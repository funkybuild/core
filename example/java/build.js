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
    ['when', 'java', 'lodash', 'util'], 
    function (when, java, _, helpers, util) {
        var subproj = java.sdl(__dirname + '/javaroot/subproj');
        var c = java.compile(subproj);

        when(
            c({version:'0.0.1'})
        ).then(console.log);
        
    }
);
