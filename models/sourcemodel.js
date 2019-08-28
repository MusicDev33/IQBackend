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
  sourceURL: {
    type: String
  },
  tags: {
    type: Array
  }
});

const Source = module.exports = mongoose.model('Source', SourceSchema);

module.exports.saveSource = function(source, callback) {
  source.save(callback);
}
