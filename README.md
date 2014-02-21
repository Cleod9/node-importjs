# ImportJS (For Node.js)#

----------

(For the original library and **complete usage instructions**, please see: [https://github.com/Cleod9/importjs](https://github.com/Cleod9/importjs))

This library is a Node.js port of [ImportJS](https://github.com/Cleod9/importjs) that allows you to use the same package-loading features but with node modules on the filesystem. The only difference between the browser and Node version is that you must define your modules slightly differently. See below for details.

## Installation ##

```
npm install importjs
```
And that's it! You can then start using it by simply requiring the importjs package:

```javascript
var ImportJS = require('importjs');
```

You will then have access to the library through the variable `ImportJS`. However, the Node implementation for dynamic file loading is slightly different than the browser version, in that you must write your modules as module exports.

See below for a quick example:

```
//Preload packages dynamically through the filesystem
ImportJS.preload({
	baseUrl: '',
	files: {
		tests: {
			Sample: 'Sample.js', //<- File ./tests/Sample.js will be loaded into ImportJS
		}
	},
	ready: function(files) {
		//At this point your packages are good to go, you could use this as an entry point for your application
	}
});

//Or define packages explicitly
ImportJS.pack('com.project.Class', function() {
	function Class() { 
	};
	return Class;
});
```
Then when dynamically preloading packages via the `preload()` function, you must structure your code a little differently from the browser version:

```javascript
//Return an args array that node-importjs will use to call `ImportJS.pack` once the code is ready to be compiled.
module.exports = ['tests.Sample', function(ImportJS) {
	/* Follow same syntax as browser version of ImportJS */
	
	//Module "CodeFile" is included without require()
	var CodeFile = ImportJS.unpack('some.other.CodeFile');
	
	function Sample() { 
		var foo = 'I am a Sample class';
		this.value = function() {
			return foo;
		}
	};
	return [Sample, function() {
		//-If you have circular deps, import them here and hoist them up as you would in the browser version of the code
	}];
}, false]; //<-Optional "compiled" arg if your class has dependencies that may not be loaded yet, same as browser version
```
Instead of using `ImportJS.pack()`, you are placing the arguments you would have used for `pack()`  into an array of args for node-importjs to pack for you. This array is exposed via module.exports. The library will simply make a call to `ImportJS.pack.apply(this, [yourArgs])` which allows you to retain the same global ImportJS package tree as additional files are loaded. Also note that the function wrapper for your code should take a single argument to house the ImportJS library (in this case I named it `ImportJS` for consistency). This features allows all of your packaged code files to communicate with one another explicitly through ImportJS. In other words, instead of using `require()` to retrieve your package-module hybrids you can simply load them via `ImportJS.unpack('path.to.package')`.


For **the detailed instructions on this library's features**, see the test file included in this repo, as well as the docs for the original [ImportJS](https://github.com/Cleod9/importjs).

This library also works great with [OOPS.js for Node](https://github.com/Cleod9/node-oopsjs)!


## Version History ##

**1.3.0**

-Re-implemented the method of loading modules as it did not properly support a single shared package store in 1.2.0

**1.2.0** (bugged, do not use)

-Extracted node-specific identifiers to improve linting

-Slight syntax adjustments for even better linting

-Node.js version now loads the external files via require()

**^ Note:** v1.2.0 is not backwards compatible given that packages are now loaded via Node's standard require() function. See above for details. 

**1.1.0**

-Changed file loading approach to improve debuggability in Node

**1.0.1**

-Modified for Node.js compatibility

**1.0.0**

-Initial release

----------

Copyrighted © 2013 by Greg McLeod

GitHub: [https://github.com/cleod9](https://github.com/cleod9)