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
            //console.log("Resolving fn:", str, arguments);
            return Q.resolve({ok:true, name:str, args:arguments});
        };
    };

    function rejecting(name) {
        var str = name;
        return function() {
            //console.log("Rejecting fn:", str, arguments);
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

        _.forEach(
            t.run (build_arr, targets),
            function(p) {
                //console.log("p:", p);
                Q.when(p)
                    .then(onSuccess, onError)
                    .then(writeSuccess, writeError);
            }
        );
    }

    function thrower(err) {
        throw err;
    }

    test("Can run single task", 
         [t.task('t', resolving('Single task'))], 
         ['t'], 
         function(r) {
             //console.log("r:", r);
             assert(r.name==='Single task', 'Single task');
             assert(r.ok===true, 'Task ok');
             return r;
         },
         function(err) {
             //console.log("err:", err);
             return err;
         });

    test("Failing task fails build", 
         [t.task('t', rejecting('Failer'))], 
         ['t'], 
         thrower,
         function(r) {
             //console.log("good error:", r);
             assert(r.ok===false, 'Build was failed');
             assert(r.name==='Failer', 'Right name');
             return r;
         }, 
         true);

    var build = 
    
    test("Arguments are propagated", 
         [
             t.task('t1', resolving("Task 1")),
             t.task('res', resolving("Result"), ['t1'])
         ], 
         ['res'], 
         function(r) {
             assert.equal(r.name, 'Result', 'Result is root'),
             assert.equal(r.args['0'].name, 'Task 1', 'Called with Task 1 as argument')
         }, 
         thrower);
    

});

