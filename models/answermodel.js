const mongoose = require('mongoose');

const AnswerSchema = mongoose.Schema({
  answerText: {
    type: String
  },
  votes: {
    type: Number
  },
  poster: {
    type: String
  },
  posterID: {
    type: String
  },
  posterHandle: {
    type: String
  },
  views: {
    type: String
  },
  comments: {
    type: Array
  },
  questionURL:{
    type: String
  },
  questionText: {
    type: String
  },
  time: {
    type: String // time posted
  }
});

const Answer = module.exports = mongoose.model('Answer', AnswerSchema);

module.exports.getAnswerByPoster = function(poster, callback){
  // Change FirstName LastName to FirstName-LastName
  // replaces only the first dash in the first name
  // People don't have dashes in their first name, right?
  var cleanedPoster = poster.replace('-', ' ');
  Answer.findOne({poster: cleanedPoster}, (err, answer) => {
    if (err) callback(err, null)
    if (!answer){
      callback(null, null);
    }else{
      callback(null, answer);
    }
  })
}

module.exports.getAnswersByQuestionURL = function(questionURL, callback){
  Answer.find({questionURL: questionURL}).sort({votes: 1}).exec(function(err, docs){
    if (err) throw err;
    if (docs){
      callback(null, docs);
    }else{
      callback(null, null);
    }
  })
}

module.exports.addAnswer = function(answer, callback){
  answer.save(callback)
}
