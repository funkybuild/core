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
            console.log("Resolving fn:", str, arguments);
            return Q.resolve({ok:true, name:str, args:arguments});
        };
    };

    function rejecting(name) {
        var str = name;
        return function() {
            console.log("Rejecting fn:", str, arguments);
            return Q.reject({ok:false, name:str, args:arguments});
        };
    };

    function test(name, build_arr, targets, onSuccess, onError, expectFailure) {
        if(name.substring(0,2)==='//') {
            console.log("Skipping:".blue, name.substring(2, name.length).blue);
            return;
        }

        var testName = name;
        expectFailure = expectFailure || false;

        var writeError = function(error) {
            console.log("Error:".red, testName.red, 
                        '\n', 
                        util.inspect(error).red);
        };

        var writeSuccess = function(r){
            console.log("OK:".green, testName.green);
        };

        var _writeSuccess = expectFailure?writeError:writeSuccess;
        var _writeError = expectFailure?writeSuccess:writeError;


        _.forEach(
            t.run (build_arr, targets),
            function(p) {
                console.log("p:", p);
                Q.when(p)
                    .then(onSuccess, onError)
                    .done(_writeSuccess, _writeError);
            }
        );
    }


    test("Can run single task", 
         [t.task('t', resolving('Single task'))], 
         ['t'], 
         function(r) {
             console.log("r:", r);
             assert(r.name==='Single task', 'Single task');
             assert(r.ok===true, 'Task ok');
             return r;
         },
         function(err) {
             console.log("err:", err);
             return err;
         });

    test("//Failing task fails build", 
         [t.task('t', rejecting('Failer'))], 
         ['t'], 
         function(err) {
             console.log("Error:", err);
         }, 
         function(r) {
             assert(r.ok===false, 'Build was failed'),
             assert(r.name==='Failer', 'Right name')
         }, 
         true);

    var build = [ 
        t.task('t1', resolving("Task 1")),
        t.task('t2', resolving("Task 2")),
        t.task('res', resolving("Result"), ['t1', 't2'])
    ]
    
    test("//Arguments are propagated", build, ['res'], function(r) {
        assert.equal(r.args['0'].name, 'Task 1', 'Called with Task 1 as argument'),
        assert.equal(r.args['1'].name, 'Task 2', 'Called with Task 2 as argument')
    }, assert.fail);
    

});

