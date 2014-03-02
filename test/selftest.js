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
            console.log("Rejecting:", arguments);
            return Q.reject({ok:false, name:str, args:arguments});
        };
    };

    function test(name, build_arr, targets, onSuccess, onError, expectFailure) {
        if(name.substring(0,2)==='//') {
            console.log("Skipping:".blue, name.substring(2, name.length).blue);
            return;
        }
        expectFailure = expectFailure || false;
        _.forEach(
            t.run (build_arr, targets),
            function(p) {
                Q.when(p)
                    .then(onSuccess, onError)
                    .done(
                        function(r){
                            console.log("OK:".green, name.green);
                        },
                        function(error) {
                            console.log("Error:".red, name.red, 
                                        '\n', 
                                        util.inspect(error).red);
                        }
                    );
            }
        );
    }


    test("Can run single task", 
         [t.task('t', resolving('Single task'))], 
         ['t'], 
         function(r) {
             assert(r.name==='Single task', 'Single task'),
             assert(r.ok===true, 'Task ok')
         }, assert.fail);

    var build = [ 
        t.task('t1', resolving("Task 1")),
        t.task('t2', resolving("Task 2")),
        t.task('res', resolving("Result"), ['t1', 't2'])
    ]
    
    test("//Arguments are propagated", build, ['res'], function(r) {
        assert.equal(r.args['0'].name, 'Task 1', 'Called with Task 1 as argument'),
        assert.equal(r.args['1'].name, 'Task 2', 'Called with Task 2 as argument')
    }, assert.fail);
    
    test("Failing task fails build", 
         [t.task('t', rejecting('Failer'))], 
         ['t'], 
         function(r) {
             assert(r.name==='Task 1', 'Called with Task 1 as argument'),
             assert(r.name==='Task 2', 'Called with Task 2 as argument')
         }, console.log, true);

});

