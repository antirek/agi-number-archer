var config = require('./config'),
    agiServer = require('ding-dong'),
    handler = require('./lib/handler'),
    mongoose = require('mongoose');

var debug = config['debug'];
mongoose.connect(config.mongo.connectionString);

agiServer
    .createServer(function (context) {
        handler(context, debug);
    })
    .listen(config.port);

if (debug) {
    console.log("server started");
}