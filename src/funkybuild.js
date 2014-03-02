if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['q', 'lodash'], 
function (Q,  _) {
    
    var task = function(id, dep_arr, fn) {
        var deferred = Q.defer();
        var ret = {
            id:id, 
            deferred: deferred,
            promise: deferred.promise
        };
        ret.deps = fn?dep_arr:[];
        ret.fn =  fn?fn:dep_arr;

        return ret;
    }

    

    function wire(obj) {
        return _.forIn(obj, function(val, key) {
            console.log("wire:", val, key);
            val.run = function() {  
                console.log("Run:", val, key);
                var ps = _.map(val.deps, 
                          function(dep) {
                              obj[dep].run();
                              return obj[dep].promise;
                          });
                console.log('ps:', ps);
                Q.all(ps)
                    .spread(function() {
                        var args = _.values(arguments);
                        console.log(key, "Spread:", args, val.fn);
                        Q.when(args).spread(val.fn).then(val.deferred.resolve);
                    });
            };
        });
    }

    var run = function(task_arr, targets) {
        var obj = wire(_.reduce(task_arr, function(acc, val) {
            var curr = acc[val.id];
            acc[val.id] = val; //curr?[curr, val]:[val]; 
            return acc;
        }, {}));
        return _.map(targets, function(t) {
            console.log("run:", t, obj);
            obj[t].run();
            return obj[t].promise;
        }); 
        
    }

    return {'task':task, 'run':run};
    
});
