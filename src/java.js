if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['q', 'lodash', 'child_process', 'path', 'fs'], function(Q, _, child_process, path, fs) {
    
    var src = function(dirs) {
        var d = dirs;
        return function(obj) {
            obj.srcs = _.flatten([d]);
            return Q.resolve(obj);
        };
    };

    var sdl = function() {
        return function(obj) {
            obj.src = path.join(obj.root, 'src/main/java');
            obj.test = path.join(obj.root, 'src/test/java');
            
            return Q.resolve(obj);
        };
    };

    var spawnP = function(cmd, args, options) {
        var deferred = Q.defer();
        var proc = child_process.spawn(cmd, args, options);
        console.log(args);
        try {
            proc.stdout.on('data', function (data) {
                deferred.notify({stdout_raw: data, stdout: data.toString('utf-8')});
            });

            proc.stderr.on('data', function (data) {
                deferred.notify({stderr_raw: data, stderr: data.toString('utf-8')});
            });

            proc.on('close', function (code) {
                if(code==0) {
                    deferred.resolve(code);
                } else {
                    deferred.reject(code);
                }
            });
        } catch (e) {
            deferred.reject(e);
        }
        return deferred.promise;
    };
    
    var mkdir = Q.denodeify(fs.mkdir);

    var compile = function(options) {
        return function(project) {
            console.log('compile...');
            var files = path.join(process.cwd(), project.root, project.src, '/subprojpackage/HellosDependency.java');
            var outdir = path.join(process.cwd(), project.root, '/build/classes/src');
            console.log(outdir);
            console.log(files);

            ;
            return spawnP('javac', [
                '-d', outdir, files
            ], 
                          {cwd:project.root, env:process.env})
            .then(function(arr) {
                console.log("0", arr[0]);
                console.log("1", arr[1]);
                console.log("2", arr[2]);
                return project;
            }, function(err) {
                console.log("Bad", err);
                return err;
            }, function(progress) {
                console.log(progress);
            });
        };
    };
        

    return {
        'src':src, 
        'sdl':sdl,
        'compile':compile
    };
});
