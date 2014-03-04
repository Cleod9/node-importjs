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
		var Sample = ImportJS.unpack('tests.Sample');
		var mySample = new Sample();
	}
});

//Or define packages explicitly
ImportJS.pack('com.project.Class', function(module, exports) {
	function Class() { 
	};

	//Just like Node, you can set your exports via 'module.exports' and/or 'exports'
	module.exports = Class;
});
```
So just like the browser version, you have the option of loading up files dynamically into ImportJS via the `preload()` function, or just defining them all in one file.

When dynamically preloading packages via the `preload()` function, you simply make sure that these other files also contain the `require('importjs')'` at the top.

```javascript
var ImportJS = require('importjs');

/* Follow same syntax as browser version of ImportJS */
ImportJS.pack('tests.Sample', function(module) {
	//Module "CodeFile" is included without require() thanks to ImportJS
	var CodeFile = ImportJS.unpack('some.other.CodeFile');
	
	function Sample() { 
		var foo = 'I am a Sample class';
		this.value = function() {
			return foo;
		}
	};

	//Exposes your 'exported' variable ('Sample' in this case) and a post-compilation function to run
	module.exports = Sample;
	module.postCompile = function() {
		//-If you have circular deps, import them here to hoist them up as you would in the browser version of the code
	};
});
```
As you can see, this is exactly how you would write code for this library with the browser version (except for the `require()` of course). One thing to note however, is that you are using a custom version of `module.exports` to store your package/module as a reference inside of ImportJS. Your code is then compiled for you when you call `ImportJS.preload()` or `ImportJS.compile()`. This features allows all of your packaged code files to communicate with one another explicitly through ImportJS. In other words, instead of using `require()` to retrieve your package-module hybrids you can simply load them via `ImportJS.unpack('path.to.package')`.


For **the detailed instructions on this library's features**, see the test file included in this repo, as well as the docs for the original [ImportJS](https://github.com/Cleod9/importjs).

This library also works great with [OOPS.js for Node](https://github.com/Cleod9/node-oopsjs)!


## Version History ##

**2.0.1**

-Fixed obscure bug with package IDs that would occur if you had dependencies that required an immediate unpack()

**2.0.0**

-Introduced a new programming model that merges Node.js module style with ActionScript/Java-style packages.

-Removed the "compiled" argument for pack() to improve code consistency

-Calling compile() is now always required for non-preloaded packages packages (though preloading will still compile for you)

-Renamed "files" preload parameter to "packages"

**1.4.0**

-One last major re-implementation to simplify the package declaration in Node.js

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