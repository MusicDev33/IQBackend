const mongoose = require('mongoose');

const SubjectSchema = mongoose.Schema({
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
  subjectURL:{
    type: String
  }
});

const Subject = module.exports = mongoose.model('Subject', SubjectSchema);
