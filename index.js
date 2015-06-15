var AGIServer = require('ding-dong');
var mongoose = require('mongoose');

var ResourceSchema = require('./lib/resource');
var Finder = require('./lib/finder');
var Handler = require('./lib/handler');
var Logger = require('./lib/logger');

var Server = function (config) {

    this.start = function () {
        var Resource = mongoose.model(
          'Resource', new ResourceSchema(config.mongo.collection)
        );

        var logger = new Logger(config.logger);

        var handler = new Handler(new Finder(Resource), logger, config.asterisk);

        mongoose.connect(config.mongo.connectionString);

        var agiServer = AGIServer(handler.handle);
        agiServer.start(config.port);

        logger.info("server started");
    };
};

module.exports = Server;