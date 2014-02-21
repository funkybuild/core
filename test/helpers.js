if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['when', 'util', 'lodash'], function(when, util, _) {

    var ok = function(description) {
        return '\n- ' + description;
    }

    var fail = function(description, message) {
        return '\n* ' + description + ':\n\t' + message;
    }

    var check = function(arr) {
        when.settle(arr).then(function(desc) {
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
        return when(actual(args))
            .always( 
                function(result) {
                    return _.isEqual(result, expected)
                    ? when.resolve(ok(description))
                    : when.reject(fail(description, util.inspect(result) + ' doesnt match ' + util.inspect(expected)));  
                }
            );
    };

    return {'ok':ok, 'fail': fail, 'check':check, 'equals':equals};
});
