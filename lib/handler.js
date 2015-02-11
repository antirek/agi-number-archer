'use strict';

var async = require('async');

var handler = function (context, debug) {

    context.on('variables', function (vars) {

        if (debug) console.log(vars);

        var stepGreeting = function (callback) {
            context.answer(function (err, result) {
                context.streamFile("beep", '#', function (err, result) {
                    callback(err, result);
                });
            });
        };

        var stepFinish = function () {
            context.end(function () {
                if(debug) console.log('end');
            });
        };

        async.waterfall([
            function (callback) {
                stepGreeting(function (err, result) {
                    if (err) { stepError(); }
                    else { callback(null, result); }
                });
            },
            function (result) {
                stepFinish();
            }
        ]);
    });
};

module.exports = handler;