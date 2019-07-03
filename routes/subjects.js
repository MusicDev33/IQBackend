const express = require('express')
const router = express.Router()
const User = require('../models/usermodel')
const Question = require('../models/questionmodel')
const Answer = require('../models/answermodel')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const AutoRes = require('../RouteUtils/autores')
const config = require('../config/database')
const Subject = require('../models/subjectmodel')
const StringUtils = require('../ProtoChanges/string')


router.post('/:subjectname', (req, res, next) => {
  var subjectName = StringUtils.titleCase(req.params.subjectname.trim())
  subjectName = subjectName.replace(/-/g, ' '); // replaces dashes with spaces
  var subjectURL = Subject.subjectNameToURL(subjectName)
  var newSubject = new Subject({
    name: subjectName,
    followers: 0,
    subjectURL: subjectURL,
    views: 0
  })

  Subject.findOne({name: subjectName}, (err, subject) => {
    if (err) throw err;
    if (!subject){
      Subject.addSubject(newSubject, (err, subject) => {
        if (err) throw err;
        if (subject){
          res.json({success: true, msg: "Subject added!"});
        }else{
          res.json({success: false, msg: "Subject could not be added..."});
        }
      })
    }else{
      res.json({success: false, msg: "This topic already exists!", subject: subject});
    }
  })
});

router.get('/:subjectname/questions', (req, res, next) => {
  var subjectName = StringUtils.titleCase(req.params.subjectname.trim())
  subjectName = subjectName.replace(/-/g, ' ');
  Question.find({subject: subjectName}, (err, questions) => {
    if (err) throw err;
    if (questions.length){
      res.json({success: true, questions: questions});
    }else{
      res.json({success: false, msg: "Couldn't find any questions on this topic."});
    }
  })
});

router.get('/:subjectname/count', (req, res, next) => {
  var subjectName = StringUtils.titleCase(req.params.subjectname.trim())
  subjectName = subjectName.replace(/-/g, ' ');
  Question.estimatedDocumentCount({subject: subjectName}, (err, count) => {
    if (err) throw err;
    if (count){
      res.json({success: true, msg: "Question count successfully estimated.", count: count})
    }
  })
})


module.exports = router;
