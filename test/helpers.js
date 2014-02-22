if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['q', 'util', 'lodash'], function(Q, util, _) {

    var ok = function(description) {
        return Q.resolve('\n- ' + description);
    }

    var fail = function(description, message) {
        return Q.reject('\n* ' + description + ':\n\t' + message);
    }

    var check = function(arr) {
        Q.allSettled(arr).then(function(desc) {
            var failed = _.any(desc, function(v) {return v.state=='rejected';});
            
            if(failed) util.puts("Failed checks")
            else util.puts("Checks PASSED!");
            
            _.forEach(desc, function(d) {
                d.state=='rejected'
                    ? util.print(d.reason)
                    : util.print(d.value);
            });
        }, console.err).then(function() {util.puts('\n---');}, console.err);
    }

    var equals = function(description, actual, args, expected) {
        return Q.when(actual(args))
            .then( 
                function(result) {
                    return _.isEqual(result, expected)
                    ? ok(description)
                    : fail(description, util.inspect(result) + ' doesn\'t match ' + util.inspect(expected));  
                }
            );
    };

    return {'ok':ok, 'fail': fail, 'check':check, 'equals':equals};
});
