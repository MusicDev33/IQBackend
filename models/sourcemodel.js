const mongoose = require('mongoose');

const SourceSchema = mongoose.Schema({
  name: {
    type: String
  },
  followers: {
    type: Number
  },
  questions: {
    type: Number
  },
  posterID: {
    type: String
  },
  views: {
    type: String
  },
  sourceURL:{
    type: String
  }
});

const Source = module.exports = mongoose.model('Source', SourceSchema);
