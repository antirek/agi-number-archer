var AGIServer = require('ding-dong');
var mongoose = require('mongoose');
var Joi = require('joi');

var ResourceSchema = require('./lib/resource');
var Finder = require('./lib/finder');
var Handler = require('./lib/handler');
var Logger = require('./lib/logger');
var ConfigSchema = require('./lib/configSchema');


var Server = function (config) {

    var logger; 

    var log = function (text, object) {
        if (logger) {
            logger.info(text, object);
        } else {
            console.log(text, object);
        }
    };

    var validate = function (callback) {
        Joi.validate(config, ConfigSchema, callback);
    };

    var init = function () {
        var Resource = mongoose.model(
          'Resource', new ResourceSchema(config.mongo.collection)
        );

        logger = new Logger(config.logger);

        var handler = new Handler(new Finder(Resource), logger, config.asterisk);

        mongoose.connect(config.mongo.connectionString);

        var agiServer = AGIServer(handler.handle);
        agiServer.start(config.port);

        log("server started");
    };

    this.start = function () {
        validate(function (err, value) {
            if (err) {
                log('config.js have errors', err);
            } else {
                log('config.js validated successfully!');
                init();    
            }
        });
    };
};

module.exports = Server;