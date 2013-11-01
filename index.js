var fs = require('fs');

eval(fs.readFileSync('./lib/import.js').toString());

module.exports = ImportJS;