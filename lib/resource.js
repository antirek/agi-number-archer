var mongoose = require('mongoose'),
    config = require('../config');

var Schema = mongoose.Schema;

var ResourceSchema = new Schema({
  code: String,
  begin: String,
  end: String,
  capacity: String,
  operator: String,
  region: {
    code: String,
    title: String
  }
},{ collection: config.mongo.collection });

module.exports = ResourceSchema;