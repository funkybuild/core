var requirejs = require('requirejs');

requirejs.config({
    baseUrl: __dirname + '/../src',
    nodeRequire: require
});

requirejs(['q', 'java', 'lodash', '../test/helpers', 'util'], 
function (Q, java, _, check, util) {
    var eq = check.equals;

    check.check([
        
        eq('Can create standard directory layout project', 
           java.sdl(), {root: '.'}, 
           {
               root: '.', 
               src:'./src/main/java', 
               test:'./src/test/java'
           }),
        
        eq('Can add source dir', 
           java.src(['.']), {}, {srcs:['.']})

        
    ]);
    
});

