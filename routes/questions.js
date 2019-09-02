const express = require('express')
const router = express.Router()
const User = require('../models/usermodel')
const Question = require('../models/questionmodel')
const Answer = require('../models/answermodel')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const AutoRes = require('../RouteUtils/autores')
const Vote = require('../models/votemodel')

// Find a way to make this :questionurl instead of /add
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
    asker: req.body.asker,
    askerID: req.body.askerID,
    askerHandle: req.body.askerHandle,
    votes: 1,
    views: 1,
    details: "",
    time: ""
  });

  Question.addQuestion(newQuestion, (err, question) => {
    messages = ["Error on adding question.", "Question added: " + question.questionText]
    res.json(AutoRes.AutoResC2(err, question, messages));
  });
});

router.post("/:questionid/:userid/:answerid/votes/:vote", (req, res, next) => {
  Vote.addVote(req.params.userid, req.params.answerid, Number(req.params.vote), req.params.questionid, (err, newVote, oldVote) => {
    Answer.adjustVotes(req.params.answerid, newVote, oldVote, (err, newAnswer) => {
      if (newAnswer){
        res.json({success: true, msg: "Voted successfully!"})
      }else{
        res.json({success: false, msg: "Vote failed..."})
      }
    })
  })
})

router.get('/:questionURL', (req, res, next) => {
  console.log(req.params.questionURL)
  Question.getQuestionByURL(req.params.questionURL, (err, question) => {
    if (err) throw err;
    if (question){
      question.views += 1
      question.save( (err, updatedQuestion) => {
        if (err) throw err;
        if(updatedQuestion){
          res.json({success: true, question: updatedQuestion});
        }else{
          res.json({success: false, msg: "Couldn't update question views."})
        }
      })
    }else{
      res.json({success: false, msg: "Couldn't get dat question, yo!"});
    }
  })
})

router.get('/id/:questionid', (req, res, next) => {
  Question.findOne({_id: req.params.questionid}, (err, question) => {
    if (err) throw err;
    if (question){
      question.views += 1
      question.save( (err, updatedQuestion) => {
        if (err) throw err;
        if(updatedQuestion){
          res.json({success: true, question: updatedQuestion});
        }else{
          res.json({success: false, msg: "Couldn't update question views."})
        }
      })
    }else{
      res.json({success: false, msg: "Couldn't get dat question by its _id, yo!"});
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
  Answer.getAnswersByQuestionURL(req.params.questionURL, (err, answers) => {
    if (err) throw err;
    if (answers){
      res.json({success: true, answers: answers})
    }else{
      res.json({success: false, msg: "Couldn't find any answers, maybe go write one!"})
    }
  })
})

router.get('/:questionid/answers/votes/:userid', (req, res, next) => {
  Vote.find({questionid: req.params.questionid, userid: req.params.userid}, (err, votes) => {
    if (err) throw err;
    if (votes.length){
      res.json({success: true, votes: votes})
    }else{
      res.json({success: false, msg: "Could not get votes from questionid"})
    }
  })
})

router.post('/:questionURL/answers/add', (req, res, next) => {
  let answer = new Answer({
    questionURL: req.params.questionURL,
    answerText: req.body.answerText,
    votes: 0,
    views: 1,
    poster: req.body.poster,
    posterID: req.body.posterID,
    posterHandle: req.body.posterHandle,
    questionText: req.body.questionText
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
