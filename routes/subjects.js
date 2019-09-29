const express = require('express')
const router = express.Router()
const User = require('../models/usermodel')
const Question = require('../models/questionmodel')
const Answer = require('../models/answermodel')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const AutoRes = require('../RouteUtils/autores')
const Subject = require('../models/subjectmodel')
const StringUtils = require('../ProtoChanges/string')


router.post('/:subjectname', (req, res, next) => {

  if (req.params.subjectname.length < 3) {
    return res.json({success: false, msg: 'Subject name is too short'});
  }

  if (!req.params.subjectname.match(/^[a-zA-Z0-9\-']+$/g)) {
    return res.json({success: false, msg: "Subject names are alphanumeric (and may contain dashes and apostrophes)"})
  }

  // Still not sure what the cutoff should be
  if (req.params.subjectname.length > 35) {
    return res.json({success: false, msg: 'Subject name is too long'});
  }

  let subjectName = StringUtils.titleCase(req.params.subjectname.trim())
  subjectName = subjectName.replace(/-/g, ' '); // replaces dashes with spaces
  const subjectURL = Subject.subjectNameToURL(subjectName)
  const newSubject = new Subject({
    name: subjectName,
    followers: 0,
    subjectURL: subjectURL,
    views: 0
  })

  Subject.findOne({name: subjectName}, (err, subject) => {
    if (err) throw err;
    if (!subject) {
      Subject.addSubject(newSubject, (err, subject) => {
        if (err) throw err;
        if (subject){
          res.json({success: true, msg: "Subject added!", subject: subject});
        } else {
          res.json({success: false, msg: "Subject could not be added..."});
        }
      })
    } else {
      res.json({success: false, msg: "This topic already exists!", subject: subject});
    }
  })
});

router.get('/search/:searchterms', (req, res, next) => {
  Subject.searchByName(req.params.searchterms.substring(0, 39), (err, subjects) => {
    if (subjects.length) {
      res.json({success: true, subjects: subjects});
    } else {
      res.json({success: false,
                msg: 'Couldn\'t find any subjects based on your search terms...',
                subjects: []});
    }
  })
})

router.get('/:subjectname/questions', (req, res, next) => {
  let subjectName = StringUtils.titleCase(req.params.subjectname.trim())
  subjectName = subjectName.replace(/-/g, ' ');
  Question.find({subject: subjectName}, (err, questions) => {
    if (err) throw err;
    if (questions.length){
      res.json({success: true, questions: questions});
    } else {
      res.json({success: false, msg: "Couldn't find any questions on this topic."});
    }
  })
});

router.get('/:subjectname/count', (req, res, next) => {
  let subjectName = StringUtils.titleCase(req.params.subjectname.trim())
  subjectName = subjectName.replace(/-/g, ' ');
  Question.estimatedDocumentCount({subject: subjectName}, (err, count) => {
    if (err) throw err;
    if (count){
      res.json({success: true, msg: "Question count successfully estimated.", count: count})
    }
  })
})

router.get('/', (req, res, next) => {
  Subject.find({}, (err, subjects) => {
    if (err) throw err;
    if (subjects.length) {
      res.json({success: true, subjects: subjects})
    } else {
      res.json({success: false, msg: 'Couldn\'t find any subjects.'})
    }
  })
})

module.exports = router;
