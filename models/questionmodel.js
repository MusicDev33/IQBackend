const mongoose = require('mongoose');
const StringUtils = require("../ProtoChanges/string");

const QuestionSchema = mongoose.Schema({
  questionText: {
    type: String
  },
  urlText: {
    type: String
  },
  asker: {
    type: String
  },
  askerID: {
    type: String
  },
  askerHandle: {
    type: String
  },
  subject: {
    type: String
  },
  homeworkSource: {
    type: String
  },
  views: {
    type: Number
  },
  votes: {
    type: Number
  },
  answers: {
    type: Array
  },
  details: {
    type: String
  },
  time: {
    type: String
  },
  tags: {
    type: Array
  },
  type: {
    type: String,
    default: 'question'
  }
});

const Question = module.exports = mongoose.model('Question', QuestionSchema);

module.exports.questionTextToURL = function(questionText){
  let urlText = ""
  const specialChars = "!@#$%^&*()>< '/\\"

  for (let i = 0; i < questionText.length; i++) {
    if (specialChars.indexOf(questionText[i]) > -1){
      urlText += "-"
    }else if (questionText[i] == "?"){

    }else{
      urlText += questionText[i]
    }
  }
  return urlText
}

module.exports.getQuestionByURL = function(qURL, callback){
  Question.findOne({urlText: qURL}, (err, question) => {
    if (err) callback(err, null)
    if (!question){
      callback(null, null);
    }else{
      callback(null, question);
    }
  })
}

module.exports.addQuestion = function(question, callback){
  // source is the source of the homework question, like Mastering Physics or ALEKS
  Question.findOne({questionText: question.questionText}, (err, foundQuestion) => {
    if (err) throw err;
    if (foundQuestion) {
      callback(null, null);
    } else {
      question.save((err, savedQuestion) => {
        if (err) throw err;
        if (savedQuestion) {
          callback(null, savedQuestion);
        } else {
          callback(null, null)
        }
      });
    }
  })
}

module.exports.findBySourceName = function(sourceName, callback){
  Question.find({homeworkSource: sourceName}, (err, questions) => {
    if (err) throw err;
    if (questions) {
      callback(null, questions);
    } else {
      callback(null, null);
    }
  })
}

module.exports.searchByName = function(searchTerm, callback){
  const regexp = '\\b(' + StringUtils.sanitize(searchTerm) + ')\\b';
  Question.find({questionText: {$regex : regexp, $options: 'i'}}).lean().exec((err, questions) => {
    if (err) throw err;
    if (questions) {
      let returnQuestions = [];
      questions.forEach(question => {
        let questionObj = {urlText: question.urlText, name: question.questionText}
        returnQuestions.push(questionObj);
      })
      callback(null, returnQuestions)
    } else {
      callback(null, null)
    }
  })
}

module.exports.deleteAll = function(callback) {
  Question.deleteMany({}, (err, deleted) => {
    if (err) throw err;
    if (deleted) {
      callback(null, 'deleted')
    } else {
      callback(null, null);
    }
  })
}
