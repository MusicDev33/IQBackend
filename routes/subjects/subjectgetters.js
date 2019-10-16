const modPath = require('../modelpath')
const modelPath = modPath.MODEL_PATH;
const Subject = require(modelPath + 'subjectmodel')
const Question = require(modelPath + 'questionmodel')

const StringUtils = require('../../ProtoChanges/string')

module.exports.getAllSubjects = function(req, res, next) {
  Subject.find({}, (err, subjects) => {
    if (err) throw err;
    if (subjects.length) {
      res.json({success: true, subjects: subjects})
    } else {
      res.json({success: false, msg: 'Couldn\'t find any subjects.'})
    }
  })
}

module.exports.getSubjectQuestionCount = function(req, res, next) {
  let subjectName = StringUtils.titleCase(req.params.subjectname.trim())
  subjectName = subjectName.replace(/-/g, ' ');
  Question.estimatedDocumentCount({subject: subjectName}, (err, count) => {
    if (err) throw err;
    if (count){
      res.json({success: true, msg: "Question count successfully estimated.", count: count})
    }
  })
}

module.exports.getSubjectQuestions = function(req, res, next) {
  let subjectName = StringUtils.titleCase(req.params.subjectname.trim())
  subjectName = subjectName.replace(/-/g, ' ');
  Question.find({subject: subjectName}).sort({_id: -1}).exec((err, questions) => {
    if (err) throw err;
    if (questions.length){
      res.json({success: true, questions: questions});
    } else {
      res.json({success: false, msg: "Couldn't find any questions on this topic."});
    }
  })
}
