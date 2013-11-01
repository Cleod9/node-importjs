var fs = require('fs');

eval(fs.readFileSync(__dirname + '/lib/import.js').toString());
ImportJS.settings.node_flag = true;

module.exports = ImportJS;