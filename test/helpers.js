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

    var check = function(promise, assert) {
        return when(promise).then(assert, fail).then(ok, fail).always(util.print);
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
