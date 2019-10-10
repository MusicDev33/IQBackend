// This module is going to be composed
// of getters for top-level resources in the user only
const modPath = require('../modelpath')
const modelPath = modPath.MODEL_PATH;
const User = require(modelPath + 'usermodel')
const Question = require(modelPath + 'questionmodel')
const Answer = require(modelPath + 'answermodel')
const Source = require(modelPath + 'sourcemodel')
const Subject = require(modelPath + 'subjectmodel')

module.exports.getUserByHandleRoute = function(req, res, next) {
  User.getUserByHandle(req.params.handle, (err, user) => {
    if (err) throw err;
    if (user) {
      user.password = '';
      return res.json({success: true, msg: "Successfully found user.", user: user})
    } else {
      return res.json({success: false, msg: "Couldn't find user by handle."})
    }
  })
}

module.exports.getUserQuestionsRoute = function(req, res, next) {
  Question.find({askerID: req.params.userid}).sort({_id: -1}).exec((err, questions) => {
    if (err) throw err;
    if (questions){
      return res.json({success: true, msg: "Successfully found questions.", questions: questions})
    } else {
      return res.json({success: false, msg: "Couldn't find user's questions."})
    }
  })
}

module.exports.getUserAnswersRoute = function(req, res, next) {
  Answer.find({posterID: req.params.userid}).sort({_id: -1}).exec((err, answers) => {
    if (err) throw err;
    if (answers){
      return res.json({success: true, msg: "Successfully found answers.", answers: answers})
    } else {
      return res.json({success: false, msg: "Couldn't find user's answers."})
    }
  })
}

module.exports.getUserProfileRoute = function(req, res, next) {
  req.user.password = '';
  return res.json({success: true, user: req.user});
}
