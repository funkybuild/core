if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['q', 'lodash', 'util'], 
function (Q, _, util) {
    
    var task = function(id, fn, dep_arr) {
        var deferred = Q.defer();
        return {
            id:id, 
            deferred: deferred,
            promise: deferred.promise,
            deps: dep_arr||[],
            fn: fn
        };
    }    

    function wire(obj) {
        return _.forIn(obj, function(val, key) {
            //console.log("wiring", key, val);
            val.run = _.once(function() {
                //console.log("Running...", key, val);
                var ps = _.map(val.deps, 
                               function(dep) {
                                   obj[dep].run();
                                   return obj[dep].promise;
                               });
                //console.log("ps:", ps);
                Q.all(ps)
                    .spread(function() {
                        var args = _.values(arguments);
                        //console.log("Spread:", args);
                        Q.when(args)
                            .spread(val.fn)
                            .then(
                                function(r) {
                                    //console.log("Resolving:", r);
                                    val.deferred.resolve(r);
                                }, 
                                function(err) {
                                    //console.log("Rejecting:", err);
                                    val.deferred.reject(err);
                                }
                            );
                    }, function(err) {
                        //console.log("Error wire:", err);
                        val.deferred.reject(err);
                        return err;
                    });
            });
        });
    }

    var run = function(task_arr, targets) {
        var obj = wire(_.reduce(task_arr, function(acc, val) {
            var curr = acc[val.id];
            acc[val.id] = val; //curr?[curr, val]:[val]; 
            return acc;
        }, {}));
        //console.log( "Wired:", obj);
        return _.map(targets, function(t) {
            //console.log("run:", t, obj[t]);
            if(!obj[t]) return Q.reject('Cannot find task ' + t + ' in ' + util.inspect(obj));
            obj[t].run();
            //console.log("has run:", t, obj);
            
            return obj[t].promise;
        }); 
    }

    return {'task':task, 'run':run};
    
});
