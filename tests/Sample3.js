//Demonstrates an external js "Class" file compatible with ImportJS with a dependancy

module.exports = ['tests.Sample3', function() {
	//Save the dependency
	var Sample2;

	function Sample3() { 
		//Print class name
		this.toString = function() {
			return '[Sample3]';
		};
		//Return a new instance of Sample2
		this.giveMeASample2 = function() {
			return new Sample2();
		};
	};
	return [Sample3, function() {
		Sample2 = ImportJS.unpack('tests.Sample2'); //Hoist up Sample2
	}];
}, false];