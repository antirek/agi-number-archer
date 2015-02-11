var mongoose = require('mongoose');

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
},{ collection: 'test_insert' });

module.exports = ResourceSchema;