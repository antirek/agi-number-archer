var AGIServer = require('ding-dong');
var mongoose = require('mongoose');
var Joi = require('joi');

var ResourceSchema = require('./lib/resource');
var Finder = require('./lib/finder');
var Handler = require('./lib/handler');
var ConfigSchema = require('./lib/configSchema');
var console = require('tracer').colorConsole();


var Server = function (config) {

    var validate = function (callback) {
        Joi.validate(config, ConfigSchema, callback);
    };

    var init = function () {
        var Resource = mongoose.model(
          'Resource', new ResourceSchema(config.mongo.collection)
        );

        var handler = new Handler(new Finder(Resource), config.asterisk);

        mongoose.connect(config.mongo.connectionString);

        var agiServer = AGIServer(handler.handle);
        agiServer.start(config.port);

        console.log("server started");
    };

    this.start = function () {
        validate(function (err, value) {
            if (err) {
                console.log('config.js have errors', err);
                return;
            }
            
            console.log('config.js validated successfully!');
            init();    
            
        });
    };
};

module.exports = Server;