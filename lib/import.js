/*******************************
	ImportJS Version 1.0.0 for NodeJS
	
    A basic package-structuring import system for JavaScript Objects.
	
    Copyright (c) 2013 Greg McLeod  (Email: cleod9{at}gmail.com)

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
	
	It is requested that you maintain all or part of this copyright notice even in the minified version.
*******************************/
var ImportJS = {
	pkgs: {}, //Object used to create package structure
	uncompiled: [], //Track uncompiled classes
	compiled: [], //Track compiled classes
	settings: { debug: false, delimiter: '.', node_flag: false },
	pack: function(id, cls, uncompiled) {
		//Error check
		if(typeof id != 'string')
			throw new Error('ImportJS Error: Provided package ID must be a string.');
		if(typeof cls != 'object' && typeof cls != 'function')
			throw new Error('ImportJS Error: Provided class was not an Object or Function.');

		//Split the path by delimiter
		var path = id.split(ImportJS.settings.delimiter);
		if(path.length > 0) {
			//Helper function to recursively generate class paths
			var createPackage = function(node, list) {
				if(list.length == 1) {
					if(typeof node[list[0]] != 'undefined')
						throw new Error("ImportJS Error: Package " + id + " already exists.");
					else {
						if(uncompiled === false) {
							ImportJS.uncompiled.push(id);
							node[list[0]] = cls; //Stores the class reference without compiling
						} else {
							ImportJS.compiled.push(id);
							node[list[0]] = cls(); //Stores the class reference after compiling
						}
					}
				} else {
					if(typeof node[list[0]] == 'undefined')
						node[list[0]] = {};
					createPackage(node[list[0]], list.slice(1));
				}
			};
			createPackage(ImportJS.pkgs, path);
		} else
			throw new Error("ImportJS Error: Invalid package ID.")
	},
	unpack: function(id)
	{
		//Error check
		if(typeof id != 'string')
			throw new Error('ImportJS Error: Provided package ID must be a string.');
		//Split the path by delimiter
		var path = id.split(ImportJS.settings.delimiter);
		if(path.length > 0) {
			var fetchPackage = function(node, list) {
				if(typeof node[list[0]] == 'undefined')
					throw new Error('ImportJS Error: Package ID ' + id + ' does not exist.');
				if(list.length == 1) {
					//Compile the node if needed
					if(ImportJS.uncompiled.indexOf(id) >= 0) {
						var args = node[list[0]](); 
						ImportJS.uncompiled.splice(ImportJS.uncompiled.indexOf(id), 1);
						ImportJS.compiled.push(id);
						node[list[0]] = args[0]; //Inject proper class reference before unpacking
						args[1](); //Now safe to build dependencies
					}
					return node[list[0]];
				}
				else
					return fetchPackage(node[list[0]], list.slice(1));
			};
			return fetchPackage(ImportJS.pkgs, path)
		} else
			throw new Error("Package.js Error: Invalid package ID.")
	},
	compile: function() {
		while(ImportJS.uncompiled.length > 0) {
			ImportJS.unpack(ImportJS.uncompiled[0]);
		}
	},
	preload: function(params) {
		if(typeof params != 'object')
			throw new Error("ImportJS Error: No parameters supplied.")

		var settings = {
			baseUrl: params.baseUrl || '', //Base path for the preload
			files: params.files || [], //Object or Array of file paths. Use relative to the baseUrl, recommended not to use parent directories ('..')
			ready: params.ready || null,  //Ready callback
			error: params.error || null, //Error callback
			removeTags: (params.removeTags === false) ? false : true, //Remove generated from head as they are loaded
			strict: (params.strict === false) ? false : true, //Strictly verify package existence upon load
			timeout: (params.timeout) ? params.timeout : 5000, //Amount of ms to timeout
			libs: params.libs || [], //Array of extra urls to any files you want to load outside of ImportJS (Similar to using 'files' param with strict = false)
			autocompile: (params.autocompile === false) ? false : true //ImportJS will call compile() when all items have finished loading
		};
		//Fix path if needed
		if(settings.baseUrl == './' || settings.baseUrl == '')
			settings.baseUrl = '.';
		if(settings.baseUrl.lastIndexOf('/') == settings.baseUrl.length - 1)
			settings.baseUrl = settings.baseUrl.substr(0, settings.baseUrl.length - 1);

		var i;
		var isNode = ((require && require.main === module) || ImportJS.settings.node_flag);
		var filesArr = (typeof settings.files.length == 'number') ? settings.files : []; //User may provide array or object
		var libsArr = settings.libs;
		var packageArr = [];
		var loadedFiles = [];
		var erroredFiles = [];
		var objToPath = function(obj, filePathBuffer, pkgBuffer) {
			for(var key in obj) {
				if(typeof obj[key] == 'string') {
					filesArr.push(filePathBuffer + '/' + obj[key]);
					packageArr.push((pkgBuffer + ImportJS.settings.delimiter + key).substr(ImportJS.settings.delimiter.length)); //Add the package name (remove extra delimiter at string start)
				}
				else if(typeof obj[key] == 'object')
					objToPath(obj[key], filePathBuffer + '/' + key, pkgBuffer + ImportJS.settings.delimiter + key);
				else
					throw new Error("ImportJS Error: Paths can only contain Objects and String values.")
			}
		};

		if(filesArr.length == 0) {
			objToPath(settings.files, settings.baseUrl, '');
		} else {
			//File list was provided, attempt to determine class paths if possible
			for(i = 0; i < settings.files.length; i++) {
				var clsPath = settings.files[i].split('/').join(ImportJS.settings.delimiter);
				clsPath = clsPath.substr(0, clsPath.length - 3);
				packageArr.push(clsPath);
			}
		}

		if(filesArr.length == 0) {
			if(typeof settings.ready == 'function')
				settings.ready();
		}
		
		var loadScript = function(filePath, clsPath) {
			//Specific handling for node.js
			if(isNode) {
				if(!fs)
					return; //Safety check
				try
				{
					var source = fs.readFileSync(filePath).toString();
					eval(source);
					if(clsPath && settings.strict) {
						if(ImportJS.compiled.indexOf(clsPath) < 0 && ImportJS.uncompiled.indexOf(clsPath) < 0)
							throw new Error("Import js Error: Invalid or missing package definition for " + clsPath + " (using strict)");
					}
					loadedFiles.push(filePath);
					if(loadedFiles.length == filesArr.length + libsArr.length) {
						if(settings.autocompile) {
							ImportJS.compile();
						}
						if(typeof settings.ready == 'function')
							settings.ready(loadedFiles);
					}
				} catch(e)
				{
					console.log(e);
					erroredFiles.push(filePath);
					if(typeof settings.error == 'function')
						settings.error(erroredFiles);
				}
				return;
			}
			var done = false;
			var head = document.getElementsByTagName('head')[0];
			var script = document.createElement('script');
			var timeout = null;
			script.type= 'text/javascript';
			//In case onerror fails
			var loadFunc = function () {
				if(settings.removeTags)
					head.removeChild(script)
				done = true;
				clearTimeout(timeout);
				//If clsPath provided and strict mode is on (no clsPath for libs)
				if(clsPath && settings.strict) {
					if(ImportJS.compiled.indexOf(clsPath) < 0 && ImportJS.uncompiled.indexOf(clsPath) < 0)
						throw new Error("Import js Error: Invalid or missing package definition for " + clsPath + " (using strict)");
				}
				loadedFiles.push(filePath);
				if(loadedFiles.length == filesArr.length + libsArr.length) {
					if(settings.autocompile) {
						ImportJS.compile();
					}
					if(typeof settings.ready == 'function')
						settings.ready(loadedFiles);
				}
			}
			var errorFunc = function() {
				if(settings.removeTags)
					head.removeChild(script);
				erroredFiles.push(filePath);
				clearTimeout(timeout);
				if(loadedFiles.length + erroredFiles.length >= filesArr.length + libsArr.length) {
					if(typeof settings.error == 'function')
						settings.error(erroredFiles);
					if(ImportJS.settings.debug)
						console.log('ImportJS Error: Could not preload the following files: [' + erroredFiles.join(', ') + ']');
				}
			}
			timeout = setTimeout(function() { 
				if(ImportJS.settings.debug)
					console.log('ImportJS Error: Timed out on file: ' + filePath);
				errorFunc();
			}, settings.timeout);
			script.onreadystatechange = function () {
				if (!done && (!script.readyState || this.readyState == 'complete' || this.readyState == 'loaded')) {
					loadFunc();
				}
			};
			script.onload = loadFunc;
			script.onerror = errorFunc;
			//Add to DOM
			script.src = filePath;
			head.appendChild(script);
		}
		//Function to kick off filesArr parsing
		var loadPackageScripts = function() {
			for(var i = 0; i < filesArr.length; i++)
				loadScript(filesArr[i], packageArr[i]);
		};
		
		//Start with the libs (if there are any)
		if(libsArr.length > 0)
		{
			var currentLib = 0;
			//Create new preload instances using hard-coded settings to ensure load order (inherits original settings)
			var loadChainer = function(file, success, fail) {
				ImportJS.preload({
					baseUrl: settings.baseUrl,
					removeTags: settings.removeTags,
					strict: false,
					timeout: settings.timeout,
					autocompile: false,
					files: [file], //Only pass in the one file provided
					ready: success,
					error: fail
				});
			};
			var success, fail;
			success = function(arr) { 
				loadedFiles.push(arr[0]); //Record that the file was loaded
				if(currentLib < libsArr.length)
					loadChainer(libsArr[currentLib++], success, fail); //Chain load next script
				else if(filesArr.length <= 0) {
					//No other files to load
					if(typeof settings.ready == 'function')
						settings.ready(loadedFiles);
				} else {
					//Begin loading scripts from filesArr
					loadPackageScripts();
				}
			};
			fail = function(arr) {
				erroredFiles.push(arr[0]); //Record that the file errored
				if(ImportJS.settings.debug)
					console.log('ImportJS Error: Could not preload the following files: [' + arr.join(', ') + ']');
				if(typeof settings.error == 'function')
					settings.error(erroredFiles);
			};
			//Execute the preload chainer
			loadChainer(libsArr[currentLib++], success, fail);
		} else {
			//Begin loading scripts from filesArr
			loadPackageScripts();
		}
	}
};