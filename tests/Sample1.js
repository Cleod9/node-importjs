//Demonstrates an external js "Class" file compatible with ImportJS

module.exports = ['tests.Sample1', function() {
	function Sample1() { 
		//Print class name
		this.toString = function() {
			return '[Sample1]';
		};
	};
	return [Sample1, function () {

	}];
}, false];