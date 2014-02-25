//Demonstrates an external js "Class" file compatible with ImportJS with a dependancy

var ImportJS = require('../index.js'); //(must use index.js since this test is local to its own module folder)

/*replace the above line with this when using the lib in your code */
// var ImportJS = require('importjs');

ImportJS.pack('tests.Sample2', function() {
	//Save the dependency
	var Sample1;
	var Sample3;

	function Sample2() { 
		//Print class name
		this.toString = function() {
			return '[Sample2]';
		};
		//Return a new instance of Sample1
		this.giveMeASample1 = function() {
			return new Sample1();
		};
		//Return a new instance of Sample3
		this.giveMeASample3 = function() {
			return new Sample3();
		};
	};
	return [Sample2, function() {
		Sample1 = ImportJS.unpack('tests.Sample1');
		Sample3 = ImportJS.unpack('tests.Sample3'); //Hoist up Sample3
	}];
}, false);