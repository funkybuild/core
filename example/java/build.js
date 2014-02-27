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
        var subproject = java.sdl({dir: 'subproject'})
        
        var creates = {
            'name.dir':path(p.dir),
            'name.srcdir': path(resolve('name.dir'), 'src/main/java'),
            'name.srcs': find_files(resolve('name.srcdir'),
            'name.testdir': path(resolve('name.dir'), 'src/test/java'),
            'name.tests': find_files(resolve('name.testdir')),
            'name.deps': mvnadd(p.deps),
            'name.libs': mvnrepo(p.libs),
            'name.testlibs': mvnadd(['junit:4.4:junit.org']),
            'junit:4.4:junit.org': mvnrepo('junit:4.4:junit.org'),
            'name.builddir': path(resolve('name.dir'), 'build'),
            'name.classesdir': path(resolve('name.build'), 'classes'),
            'name.testclassesdir': path(resolve('name.build'), 'testclasses'),
            'name.classes': compile({
                srcs: resolve('name.srcs'), 
                deps: resolve('name.deps'), 
                libs: resolve('name.libs'), 
                outdir: path(resolve('p.classesdir'))
            }),

            'name.testclasses': compile({
                srcs: resolve('name.tests'), 
                deps: [resolve('name.deps'), resolve('name.classes')], 
                libs: [resolve('name.libs'), resolve('name.testlibs')] 
                outdir: path(resolve('name.testclassesdir'))
            }),
            'name.jar': jar(resolve('name.classes')),
            testresultxml: junit({
                main:'org.junit.Runner', 
                deps: [
                    resolve('name.deps'), 
                    resolve('name.classes'), 
                    resolve('name.libs'), 
                    resolve('name.testlibs')
                ],
                options: [],
                outdir: path('name.builddir', 'testresultxml')
            })
        };

        var mainproject = java.sdl({dir: 'mainproject', dep:[subproject]});
        var warproject = java.warsdl({dir: 'warproject', dep:[mainproject]})
        
        when
            .all(subproject.testresultxml, mainproject.testresult, warproject.war)
            .spread(serialize('./results/testresult'), 
                    serialize('./results/testresult'), 
                    serialize('./results/war'));
    }
);
