if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['when', 'util', 'lodash'], function(when, util, _) {

    var ok = function(message) {
        return ".";
    }

    var fail = function(message) {
        return '\nF(' + util.inspect(message) + ')\n';
    }

    var check = function(promise, assert) {
        return when(promise).then(assert, fail).then(ok, fail).always(util.print);
    }

    var equals = function(actual, expected) {
        return when.all(
            [actual, expected]
        ).then(
            function(arr) {
                return _.isEqual(arr[0], arr[1])
                    ? ''
                    : when.reject(util.inspect(arr[0]) + ' doesnt match ' + util.inspect(arr[1]));  
            }
        ).then(ok, fail).always(util.print);};

    return {'ok':ok, 'fail': fail, 'check':check, 'equals':equals};
});
