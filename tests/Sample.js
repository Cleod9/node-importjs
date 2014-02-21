//Demonstrates an external js "Class" file compatible with ImportJS;
module.exports = ['tests.Sample', function() {
	function Sample() { 
		var foo = 'I am a Sample class';
		this.value = function() {
			return foo;
		}
	};
	return Sample;
}];