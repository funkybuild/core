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

    var sdl = function(root) {
        return function(obj) {
            obj.src = 'some src';
            obj.test = 'some test';
            obj.root = root;
            
            return when(obj);
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
