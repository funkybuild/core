var requirejs = require('requirejs');

requirejs.config({
    baseUrl: __dirname + '/../src',
    nodeRequire: require
});

requirejs(['when', 'java', 'lodash', '../test/helpers', 'util'], 
function (when, java, _, helpers, util) {
    when.all([
        helpers.check(java.src({},'.'), function(result) {throw(result);}),
        helpers.check(java.src({},'.'), function(result) {return result;})
    ]).then(function(){util.puts('');});
});

