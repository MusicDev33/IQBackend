const modPath = require('../modelpath')
const modelPath = modPath.MODEL_PATH;

const Vote = require(modelPath + 'votemodel')
const Question = require(modelPath + 'questionmodel')
const Answer = require(modelPath + 'answermodel')

module.exports.getAllQuestions = function(req, res, next) {
  Question.find().sort({'_id': -1}).exec(function(err, docs){
    if (err) throw err;
    if (docs){
      res.json({success: true, questions: docs})
    } else {
      res.json({success: false, msg: "Couldn't find any questions...maybe ask a few!"})
    }
  })
}

module.exports.getQuestionByUrl = function(req, res, next) {
  Question.getQuestionByURL(req.params.questionURL, (err, question) => {
    if (err) throw err;
    if (question){
      question.views += 1
      question.save( (err, updatedQuestion) => {
        if (err) throw err;
        if(updatedQuestion){
          res.json({success: true, question: updatedQuestion});
        } else {
          res.json({success: false, msg: "Couldn't update question views."})
        }
      })
    } else {
      res.json({success: false, msg: "Couldn't get dat question, yo!"});
    }
  })
}

module.exports.getQuestionById = function(req, res, next) {
  Question.findOne({_id: req.params.questionid}, (err, question) => {
    if (err) throw err;
    if (question){
      question.views += 1
      question.save( (err, updatedQuestion) => {
        if (err) throw err;
        if(updatedQuestion){
          res.json({success: true, question: updatedQuestion});
        } else {
          res.json({success: false, msg: "Couldn't update question views."})
        }
      })
    } else {
      res.json({success: false, msg: "Couldn't get question by _id."});
    }
  })
}

module.exports.getQuestionAnswers = function(req, res, next) {
  Answer.getAnswersByQuestionURL(req.params.questionURL, (err, answers) => {
    if (err) throw err;
    if (answers){
      res.json({success: true, answers: answers})
    } else {
      res.json({success: false, msg: "Couldn't find any answers, maybe go write one!"})
    }
  })
}

module.exports.getAnswerVotesFromUser = function(req, res, next) {
  Vote.find({questionid: req.params.questionid, userid: req.params.userid}, (err, votes) => {
    if (err) throw err;
    if (votes.length){
      res.json({success: true, votes: votes})
    } else {
      res.json({success: false, msg: "Could not get votes from questionid"})
    }
  })
}
