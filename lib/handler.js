'use strict';

var async = require('async'),
    mongoose = require('mongoose');

var ResourceSchema = require('./resource'),
    config = require('../config');


mongoose.connect(config.mongo.connectionString);
var Resource = mongoose.model('Resource', ResourceSchema);


var handler = function (context, debug) {

    context.on('variables', function (vars) {

        var return_variable = config.asterisk.dialplan_var;

        if (debug) console.log(vars);

        var number = vars[config.asterisk.agi_param_name];
        if (debug) console.log('number here', number);

        var stepGreeting = function (callback) {
            context.answer(function (err, result) {
                context.streamFile("beep", '#', function (err, result) {
                    var data = {
                        code: number.slice(1, 4),
                        number: number.slice(4)
                    };
                    callback(err, data);
                });
            });
        };

        var stepSetVariable = function (data, callback) {
            var region_code = null;
            
            try{
                region_code = data.region.code;
            }catch(e){
                region_code = 'NULL';
            }

            context.setVariable(return_variable, region_code, function (err, result){
                if (debug) console.log(err, result);
                callback(err, result);
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

        var stepFinish = function () {
            context.end(function () {
                if(debug) console.log('end');
            });
        };

        var stepError = function (){
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