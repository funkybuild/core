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

    function test(name, build_arr, targets, assertion, expectFailure) {
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
        

        var p = t.run (build_arr, targets);
        //console.log("p:", p);
        Q.all(p)
            .spread(
                expectFailure?thrower:assertion, 
                expectFailure?assertion:thrower
            )
            .then(writeSuccess, writeError);
    }

    function thrower(err) {
        throw err;
    }

    var i = "";
    test(i+"Can run single task", 
         [t.task('t', resolving('Single task'))], 
         ['t'], 
         function(r) {
             //console.log("r Can run single task:", r);
             assert.equal(r.name, 'Single task', 'Single task');
             assert.equal(r.ok, true, 'Task ok');
             return r;
         });

    test(i+"Failing task fails build", 
         [t.task('t', rejecting('Failer'))], 
         ['t'], 
         function(r) {
             //console.log("good error:", r);
             assert.equal(r.ok, false, 'Build was failed');
             assert.equal(r.name, 'Failer', 'Right name');
             return r;
         }, 
         true);

    test(i+"Failing subtask fails build",
         [
             t.task('t1', rejecting("Task 1")),
             t.task('res', resolving("Result"), ['t1'])
         ], 
         ['res'], 
         function(r) {
             assert.equal(r.ok, false, 'Subtask failed');
             assert.equal(r.name, 'Task 1', 'Failing task is propagated');
             return r;
         },
         true);

    test(i+"Failing subsubtask fails build",
         [
             t.task('t1', rejecting("Task 1")),
             t.task('t2', resolving("Task 2"), ['t1']),
             t.task('res', resolving("Result"), ['t2'])
         ], 
         ['res'], 
         function(r) {
             assert.equal(r.ok, false, 'Subsubtask failed');
             assert.equal(r.name, 'Task 1', 'Failing task is propagated');
             return r;
         },
         true);


    test(i+"Root task gets output from subtasks", 
         [
             t.task('t1', resolving("Task 1")),
             t.task('res', resolving("Result"), ['t1'])
         ], 
         ['res'], 
         function(r) {
             //console.log("r:", r);
             assert.equal(r.name, 'Result', 'Result is root');
             assert.equal(r.args['0'].name, 'Task 1', 'Called with Task 1 as argument');
         });
    

    test(i+"Can call several root targets",
         [
             t.task('res1', resolving("Result 1")),
             t.task('res2', resolving("Result 2"))
         ], 
         ['res1', 'res2'], 
         function(r1, r2) {
             //console.log("r:", r1, r2);
             assert.equal(r1.name, 'Result 1', 'First result');
             assert.equal(r2.name, 'Result 2', 'Second result');
         });

    //test("A function is only called once",

    //test("Non existent subtask is reported as error",

    //test("Event stream for wiring",

    //test("Event stream for execution",

    //test("Overridden tasks are reported",

});

