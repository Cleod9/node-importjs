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

You will then have access to the library through the variable `ImportJS`. The Node implementation is slightly different than the original library however, in that you must write your modules

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
		ImportJS.compile(); //Readies the library for use
	}
});

//Or define packages explicitly
ImportJS.pack('com.project.Class', function() {
	function Class() { 
	};
	return Class;
});
```
When preloading packages via the `preload()` function, you must structure your code a little differently from the browser version:

```javascript
//Return an args array that node-importjs will use to call `ImportJS.pack` once the code is ready to be compiled.
module.exports = ['tests.Sample', function() {
	function Sample() { 
		var foo = 'I am a Sample class';
		this.value = function() {
			return foo;
		}
	};
	return Sample;
}];
```
Instead of wrapping your code within a `pack()` function call, you are exposing the code via an array of arguments for node-importjs to pack for you. The library will simply make a call to `ImportJS.pack.apply(this, [yourArgs])` which allows you to retain the same global ImportJS package tree as additional files are loaded.


For **the detailed instructions on this library's features**, see the original [ImportJS](https://github.com/Cleod9/importjs).

This library also works great with [OOPS.js for Node](https://github.com/Cleod9/node-oopsjs)!


## Version History ##

**1.2.0**

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