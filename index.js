var fs = require('fs');

eval.call(this, fs.readFileSync(__dirname + '/lib/import.js').toString());

//Grant require functionality
ImportJS.settings.require = require;

module.exports = ImportJS;