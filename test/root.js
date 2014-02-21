var requirejs = require('requirejs');

requirejs.config({
    baseUrl: __dirname + '/../src',
    nodeRequire: require
});

requirejs(['when', 'when/parallel', 'when/sequence', 'java', 'lodash', '../test/helpers', 'util'], 
function (when, parallel, seq, java, _, check, util) {
    var 
    eq = check.equals,
    ok = check.ok,
    fail = check.fail;

    when.settle([
        eq(java.sdl(), {root: '.'}, {srcs:['.']}),
        eq(java.src(['.']), {}, {srcs:['.']})
    ]).then(function(desc) {
        _.any(desc, function(v) { return v.state=='rejected';})
            ? util.puts("Failed build")
            : _util.puts("Build SUCCESSFUL!");
        
        _.forEach(desc, function(d) {
            d.state=='rejected'
                ? util.print(d.reason)
                : util.print(d.value);
        });
    }).always(function() {util.puts('\n---');});
});

