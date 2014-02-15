if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['when', 'util'], function(when, util) {

    var ok = function(message) {
        return ".";
    }

    var fail = function(message) {
        return 'F(' + util.inspect(message) + ')';
    }

    var check = function(promise, assert) {
        return when(promise).then(assert, fail).then(ok, fail).always(util.print);
    }

    return {'ok':ok, 'fail': fail, 'check':check};
});
