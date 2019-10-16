const modPath = require('../modelpath')
const modelPath = modPath.MODEL_PATH;
const Vote = require(modelPath + 'votemodel')
const Question = require(modelPath + 'questionmodel')
const Answer = require(modelPath + 'answermodel')

module.exports.deleteAllQuestions = function(req, res, next) {
  Question.deleteAll((err, deleted) => {
    if (deleted) {
      res.json({success: true, msg: 'Successfully deleted all questions'})
    } else {
      res.json({success: false, msg: 'Something went wrong.'})
    }
  })
}

module.exports.deleteAnswer = function(req, res, next) {
  Question.removeAnswerFromQuestion(req.params.questionURL, (err, question) => {
    if (question) {
      Answer.removeAnswer(req.params.answerID, (err, answer) => {
        if (answer) {
          Vote.deleteAnswerVotes(req.params.answerID, (err, deleted) => {
            res.json({success: true, msg: 'Answer deleted', answer: answer})
          });
        } else {
          res.json({success: false, msg: 'Couldn\'t delete answer'})
        }
      })
    } else {
      res.json({success: false, msg:'Couldn\'t find question'})
    }
  })
}
