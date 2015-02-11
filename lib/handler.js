'use strict';

var async = require('async');

var handler = function (context, debug) {

    context.on('variables', function (vars) {


    	var name_var_args_with_number = 'agi_arg_1';

    	var return_variable = 'REGION_CODE';

        if (debug) console.log(vars);

        console.log('number here', vars[name_var_args_with_number]);

        var stepGreeting = function (callback) {
            context.answer(function (err, result) {
                context.streamFile("beep", '#', function (err, result) {
                    callback(err, result);
                });
            });
        };

        var stepSetVariable = function(data, callback){
        	var q = '78';
        	context.setVariable(return_variable, q, function (err, result){
        		if (debug) console.log(err, result);
                callback(err, result);
        	});
        };

        var stepFinish = function () {
            context.end(function () {
                if(debug) console.log('end');
            });
        };

		var stepError = function (){
            context.streamFile('invalid', '#', function (err, result) {
                context.end(function () {
                    console.log('end');
                });
            });
        }; 

        async.waterfall([
            function (callback) {
                stepGreeting(function (err, result) {
                    if (err) { stepError(); }
                    else { callback(null, result); }
                });
            },
            function (result, callback) {
            	stepSetVariable(result, function (err, result){
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