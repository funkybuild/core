if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['when', 'lodash'], function(when, _) {

    var src = function(obj,dirs) {
        obj.srcs = _.flatten([dirs]);
        return when(obj);
    }

    return {'src':src};
});
