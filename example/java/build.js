var requirejs = require('requirejs');
var base = __dirname + '/../../';

requirejs.config({
    baseUrl: base,
    paths: {
        'java'     : base + 'src/java',
        'build'    : base + 'example/java'
    },
    nodeRequire: require
});

requirejs(
    ['when', 'when/pipeline', 'java', 'lodash', 'util'], 
    function (when, pipe, java, _, helpers, util) {
        var subproj = java.sdl(__dirname + '/javaroot/subproj');
        var compile = java.compile({options: ''});

        pipe([subproj, compile], {}) 
            .always(console.log);
        
    }
);
