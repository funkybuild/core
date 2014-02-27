var requirejs = require('requirejs');

requirejs.config({
    baseUrl: __dirname + '/../src',
    paths: {
        tattler: '../lib/tattler',
        streams: '../lib/streams',
        'streams-fn': '../lib/streams-fn',

    },
    nodeRequire: require
});

requirejs(['q', 'java', 'lodash', 'tattler'], 
function (Q, java, _, tattler) {
    
});

