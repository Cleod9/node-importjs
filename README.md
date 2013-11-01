# ImportJS (For Node.js)#

----------

(For the original library and **complete usage instructions**, please see: [https://github.com/Cleod9/importjs](https://github.com/Cleod9/importjs))

This library is a Node.js port of [ImportJS](https://github.com/Cleod9/importjs).

## Installation ##

```
npm install importjs
```
And that's it! You can then start using it by simply requiring the importjs package:

```javascript
var ImportJS = require('importjs');
```

You will then have access to the library through the variable `ImportJS`.  Please note that this object's scope is limited to the module it was required in, so if you would like to share the same instance of the library across separate modules you will need to make sure to pass references of the `ImportJS`Object down to each of them.

Also note that ImportJS for Node.js loads external files via Javascript's `eval()` function instead of tags. 


See below for a quick example:

```
//Preload packages
ImportJS.preload({
	baseUrl: '',
	files: {
		tests: {
			Sample: 'Sample.js',
		}
	}
});

//Or define packages explicitly
ImportJS.pack('com.project.Class', function() {
	function Class() { 
	};
	return Class;
});
```

For **full instructions**, see the original [ImportJS](https://github.com/Cleod9/importjs).

This library also works great with [OOPS.js for Node](https://github.com/Cleod9/node-oopsjs)!


## Version History ##

**1.0.0**

-Initial release

----------

Copyrighted © 2013 by Greg McLeod

GitHub: [https://github.com/cleod9](https://github.com/cleod9)