//Demonstrates an external js "Class" file
ImportJS.pack('tests.Sample', function() {
	function Sample() { 
		var foo = 'I am a Sample class';
		this.value = function() {
			return foo;
		}
	};
	return Sample;
});