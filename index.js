var agiServer = require('ding-dong');
var mongoose = require('mongoose');
var ResourceSchema = require('./lib/resource');
var Finder = require('./lib/finder');
var Handler = require('./lib/handler');


var Server = function (config) {

    this.start = function () {
        var Resource = mongoose.model(
          'Resource', new ResourceSchema(config.mongo.collection)
        );

        var handler = new Handler(new Finder(Resource), config.asterisk);

        mongoose.connect(config.mongo.connectionString);

        agiServer
          .createServer(handler.handle)
          .listen(config.port);

        if (config.debug) {
            console.log("server started");
        }
    };
};

module.exports = Server;