// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var keywordSchema = new Schema({
  name: { type: String, required: true },
  images: [String]
});

// the schema is useless so far
// we need to create a model using it
var Keyword = mongoose.model('Keyword',keywordSchema);

// make this available to our users in our Node applications
module.exports = Keyword;