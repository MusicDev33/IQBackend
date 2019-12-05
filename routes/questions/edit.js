const modPath = require('../modelpath')
const modelPath = modPath.MODEL_PATH;

const Question = require(modelPath + 'questionmodel')
const Answer = require(modelPath + 'answermodel')

module.exports.editQuestionTags = function(req, res, next) {
  Question.editTags(req.params.questionid, req.body.tags, (err, oldQuestion) => {
    if (oldQuestion) {
      return res.json({success: true});
    } else {
      return res.json({success: false, msg: 'Could not update question tags.'});
    }
  });
}

module.exports.editQuestionSource = function(req, res, next) {
  Question.editSource(req.params.questionid, req.body.source, (err, oldQuestion) => {
    if (oldQuestion) {
      return res.json({success: true});
    } else {
      return res.json({success: false, msg: 'Could not update question source.'});
    }
  });
}
