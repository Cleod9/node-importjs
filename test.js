var fs = require('fs');
var ImportJS = require(__dirname + '/index.js');
ImportJS.settings.node_flag = true;

ImportJS.preload({
	baseUrl: '',
	files: {
		tests: {
			Sample: 'Sample.js',
		}
	},
	libs: [], //Additional libs
	ready: function(arr) {
		console.log("Loaded files: ", arr);
		var Sample = ImportJS.unpack('tests.Sample');
		var mySample = new Sample();
		console.log(mySample.value());
	},
	error: function(arr) {
		console.log("Errored files: ", arr);
	}
});