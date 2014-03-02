var requirejs = require('requirejs');

requirejs.config({
    baseUrl: __dirname + '/../src',
    nodeRequire: require
});

requirejs(['q', 'lodash', 'funkybuild', 'util'], 
function (Q,  _, t, util) {
    function resolving(name) {
        var str = name;
        return function() {
            return Q.resolve({ok:true, name:str, args:arguments});
        };
    };

    function rejecting(name) {
        var str = name;
        return function() {
            return Q.reject({ok:false, name:str, args:arguments});
        };
    };

    console.log("Testing funkybuild...");

    var build = [ 
        t.task('t1', resolving("Task 1")),
        t.task('t2', resolving("Task 2")),
        t.task('res', ['t1', 't2'], resolving("Result"))
    ]

    _.forEach(
        t.run (build, ['res']),
        function(p) {
            Q.when(p)
                .then(
                    function(r){
                        console.log("Result:", r);
                    },
                    function(error) {
                        console.log("Error:", error);
                    }
                );
        }
    );

});

