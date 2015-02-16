'use strict';

var async = require('async'),
    mongoose = require('mongoose');

var ResourceSchema = require('./resource'),
    config = require('../config');

var Resource = mongoose.model('Resource', ResourceSchema);


var handler = function (context, debug) {

    context.on('variables', function (vars) {
        if (debug) console.log(vars);

        var dialplan_var = config.asterisk.dialplan_var,
            number = vars[config.asterisk.agi_param_name];
        
        if (debug) console.log('number', number);


        var stepGreeting = function (callback) {

            context.answer(function (err, result) {

                var data = {
                    code: number.slice(1, 4),
                    number: number.slice(4)
                };

                if (config.asterisk.beep) {
                    context.streamFile("beep", '#', function (err, result) {                    
                        callback(err, data);
                    });
                } else {
                    callback(err, data);
                }                
                
            });
        };


        var stepLookup = function (data, callback) {
            var query = {
                code: data['code'],
                end: {
                    $gte: data['number']
                },
                begin: {
                    $lte: data['number']
                }
            };

            Resource.findOne(query, function (err, doc) {
                if (debug) console.log('hello', err, doc);

                callback(err, doc)
            });
        };


        var stepSetVariable = function (data, callback) {
            var region_code = null;
            
            try {
                region_code = data.region.code;
            } catch (e) {
                region_code = 'NULL';
            }

            context.setVariable(dialplan_var, region_code, function (err, result){
                if (debug) console.log(err, result);
                callback(err, result);
            });
        };


        var stepFinish = function () {
            context.end(function () {
                if(debug) console.log('end');
            });
        };


        var stepError = function () {
            context.streamFile('invalid', '#', function (err, result) {
                context.end(function () {
                    if (debug) console.log('end');
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
                stepLookup(result, function (err, result){
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