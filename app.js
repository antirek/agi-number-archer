var agiServer = require('ding-dong');
var mongoose = require('mongoose');
var ResourceSchema = require('./lib/resource');
var Finder = require('./lib/finder');
var Handler = require('./lib/handler');
var config = require('./config');


var Resource = mongoose.model(
    'Resource', new ResourceSchema(config.mongo.collection)
);
var handler = new Handler(new Finder(Resource), config.asterisk);
mongoose.connect(config.mongo.connectionString);
var debug = config['debug'];

agiServer.createServer(handler.handle)
    .listen(config.port);

if (config['debug']) {
    console.log("server started");
}