if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['when', 'lodash'], function(when, _) {

    var src = function(dirs) {
        var d = dirs;
        return function(obj) {
            obj.srcs = _.flatten([d]);
            return when(obj);
        };
    };

    var sdl = function() {
        return function(obj) {
            obj.src = 'some src';
            obj.test = 'some test';
            
            return when.resolve(obj);
        };
    };

    var compile = function(options) {
        return function(project) {
            var res = _.merge(project, options);
            
            return when(res);
        };
    };
        

    return {
        'src':src, 
        'sdl':sdl,
        'compile':compile
    };
});
