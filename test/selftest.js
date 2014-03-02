var requirejs = require('requirejs');

requirejs.config({
    baseUrl: __dirname + '/../src',
    nodeRequire: require
});

requirejs(['q', 'lodash', 'funkybuild', 'util', 'assert', 'colors'], 
function (Q,  _, t, util, assert, colors) {
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
        t.task('res', resolving("Result"), ['t1', 't2'])
    ]

    function test(build_arr, targets, onSuccess, onError) {
        _.forEach(
            t.run (build_arr, targets),
            function(p) {
                Q.when(p)
                    .then(onSuccess, onError)
                    .then(
                        function(r){
                            console.log("OK:".green, util.inspect(r).green);
                        },
                        function(error) {
                            console.log("Error:".red, util.inspect(error).red);
                        }
                    );
            }
        );
    }

    test(build, ['res'], function(r) {
        assert(r.args['0'].name==='Task 1', 'Called with Task 1 as argument'),
        assert(r.args['1'].name==='Task  2', 'Called with Task 2 as argument')
        return "Arguments are propagated";
    }, assert.fail);

    test(build, ['res'], function(r) {
        assert(r.args['0'].name==='Task 1', 'Called with Task 1 as argument'),
        assert(r.args['1'].name==='Task 2', 'Called with Task 2 as argument')
        return "Arguments are propagated";
    }, assert.fail);

});

