if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['when'], function(when) {
    //var dep = require('dependency');

    var src = function(obj,dirs) {
        obj.dirs = dirs
        return when(obj);
    }

    return {'src':src};
});