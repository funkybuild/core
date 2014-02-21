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
        eq('Can create standard directory layout project', 
           java.sdl(), {root: '.'}, {root: '.', src:'some src', test:'some test'}),
        eq('Can add source dir', java.src(['.']), {}, {srcs:['.']})
    ]).then(function(desc) {
        var failed = _.any(desc, function(v) {return v.state=='rejected';});
        
        if(failed) util.puts("Failed checks")
        else util.puts("Checks PASSED!");
        
        _.forEach(desc, function(d) {
            d.state=='rejected'
                ? util.print(d.reason)
                : util.print(d.value);
        });
    }, console.err).then(function() {util.puts('\n---');}, console.err);
});

