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

//Register
router.post('/add', (req, res, next) => {
  var questionURL = Question.questionTextToURL(req.body.question);
  console.log("Got a question.");
  console.log(req.body)

  let newQuestion = new Question({
    answers: [],
    questionText: req.body.question,
    urlText: questionURL,
    subject: req.body.subject,
    homeworkSource: req.body.source,
    asker: req.body.asker
  });

  Question.addQuestion(newQuestion, (err, question) => {
    messages = ["Error on adding question.", "Question added: " + question.questionText]
    res.json(AutoRes.AutoResC2(err, question, messages));
  });
});

router.get('/:questionURL', (req, res, next) => {
  console.log(req.params.questionURL)
  Question.getQuestionByURL(req.params.questionURL, (err, question) => {
    if (err) throw err;
    if (question){
      res.json({success: true, question: question});
    }else{
      res.json({success: false, msg: "Couldn't get dat question, yo!"});
    }
  })
})

router.get('', (req, res, next) => {
  Question.find().sort({'_id': -1}).exec(function(err, docs){
    if (err) throw err;
    if (docs){
      res.json({success: true, questions: docs})
    }else{
      res.json({success: false, msg: "Couldn't find any questions...maybe ask a few!"})
    }
  })
})

router.get('/:questionURL/answers', (req, res, next) => {
  Answers.getAnswersByQuestionURL(req.params.questionURL, (err, answers) => {
    if (err) throw err;
    if (answers){
      res.json({success: true, answers: answers})
    }else{
      res.json({success: false, msg: "Couldn't find any answers, maybe go write one!"})
    }
  })
})

router.post('/:questionURL/answers/add', (req, res, next) => {
  let answer = new Answer({
    questionURL: req.params.questionURL,
    answerText: req.body.answerText,
    votes: 0,
    views: 1,
    poster: req.body.poster
  })

  Answer.addAnswer(answer, (err, savedAnswer) => {
    if (err) throw err;
    if (savedAnswer){
      res.json({success: true, msg: "Answer has been added!"})
    }else{
      res.json({success: false, msg: "Answer couldn't be added for some reason."})
    }
  })
})

module.exports = router;
