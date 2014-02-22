if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['q', 'lodash'], function(Q, _) {

    var src = function(dirs) {
        var d = dirs;
        return function(obj) {
            obj.srcs = _.flatten([d]);
            return Q.resolve(obj);
        };
    };

    var sdl = function() {
        return function(obj) {
            obj.src = 'some src';
            obj.test = 'some test';
            
            return Q.resolve(obj);
        };
    };

    var compile = function(options) {
        return function(project) {
            var res = _.merge(project, options);
            
            return Q.resolve(res);
        };
    };
        

    return {
        'src':src, 
        'sdl':sdl,
        'compile':compile
    };
});
