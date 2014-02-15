var requirejs = require('requirejs');

requirejs.config({
    baseUrl: __dirname + '/../src',
    nodeRequire: require
});

var ok = function(message) {
    return "|";
}

var fail = function(message) {
    return 'F(' + message + ')';
}

var check = function(promise, assert) {
    return when(promise).then(assert).then(ok, fail);
}

requirejs(['when', 'java'], function (when, java) {
    when(java.src({},'.')).then(function(result) {throw(result);}).then(ok, fail);
    when(java.src({},'.')).then(function(){}).then(ok, fail);
});

