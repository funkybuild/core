var requirejs = require('requirejs');

requirejs.config({
    baseUrl: __dirname + '/../src',
    nodeRequire: require
});

requirejs(['when', 'java', 'lodash', '../test/helpers', 'util'], 
function (when, java, _, helpers, util) {
    when.all([
        helpers.equals(java.src({},'.'), {src:['.']}),

    ]).then(function(){util.puts('');});
});

