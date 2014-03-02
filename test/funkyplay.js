var requirejs = require('requirejs');

requirejs.config({
    baseUrl: __dirname + '/../src',
    nodeRequire: require
});

requirejs(['q', 'lodash', 'funkybuild', 'util'], 
function (Q,  _, t, util) {
    function tsk(mess) {
        var str = mess;
        return function() {
            var args = arguments;
            var rand = Math.floor(Math.random()*4001);            
            console.log(str, 'got:', args, rand);
            var d = Q.defer();
            Q.delay(rand).done(function() {
                d.resolve({name:str, delay:rand, args:args});
            });
            return d.promise;
        };
    };

    console.log("Testing funkybuild...");

    var build = [ 
        t.task('t1', tsk("Task 1")),
        t.task('t2', tsk("Task 2")),
        t.task('t3', ['t1', 't2'], tsk("Task 3"))
    ]

    var res = t.run (build, ['t3']);
    console.log("Res:", res);

    _.forEach(
        res,
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

