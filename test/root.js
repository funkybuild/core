var requirejs = require('requirejs');

requirejs.config({
    baseUrl: __dirname + '/../src',
    nodeRequire: require
});

requirejs(['when', 'when/parallel', 'when/sequence', 'java', 'lodash', '../test/helpers', 'util'], 
function (when, parallel, seq, java, _, check, util) {
    var eq = check.equals;

    check.check([
        eq('Can create standard directory layout project', 
           java.sdl(), {root: '.'}, {root: '.', src:'some src', test:'some test'}),
        eq('Can add source dir', java.src(['.']), {}, {srcs:['.']})
    ]);
    
});

