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
    ['q', 'java', 'lodash', 'util'], 
    function (Q, java, _, helpers, util) {
        //sketches
        var struct = {
            'war': java.war(collect('*/jar')),
            'subproj/jar': java.jar(collect('subproj/classes')),
            'mainproj/jar': java.jar(collect('mainproj/classes')),
            'mainproj/classes': java.compile(collect('mainproj/'))
        }
        var mainwar = 
            map_parallel([java.jar(), java.compile({options:''})],srcProjs)) ;
        
        var subproj = java.sdl({
            root:__dirname + '/javaroot/subproj',
            deps: deps('mvn:jar:junit.org:4.2+', 'ivy:jar:whatever'])
        });

        var compile = java.compile({options: ''});
        
        var jar = java.jar();
        pipe([subproj, compile, jar], {}) 
            .always(console.log);
        
    }
);
