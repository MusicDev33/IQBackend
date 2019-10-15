const express = require('express')
const router = express.Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')
const modPath = require('../modelpath')
const AutoRes = require('../../RouteUtils/autores')

const modelPath = modPath.MODEL_PATH;
const Vote = require(modelPath + 'votemodel')
const User = require(modelPath + 'usermodel')
const Question = require(modelPath + 'questionmodel')
const Answer = require(modelPath + 'answermodel')

// Find a way to make this :questionurl instead of /add
router.post('/add', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  const questionURL = Question.questionTextToURL(req.body.question);

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
    details: '',
    time: '',
    tags: req.body.tags ? req.body.tags : []
  });

  Question.addQuestion(newQuestion, (err, question) => {
    if (question) {
      res.json({success: true, msg: 'Added question successfully.'})
    } else {
      res.json({success: false, msg: 'Something went wrong...'})
    }
  });
});

router.post('/:questionid/:userid/:answerid/vote', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  console.log('voted')
  Vote.addVote(req.params.userid, req.params.answerid, Number(req.body.vote), req.params.questionid, (err, newVote, oldVote) => {
    Answer.adjustVotes(req.params.answerid, newVote, oldVote, (err, newAnswer) => {
      if (newAnswer){
        res.json({success: true, msg: "Voted successfully!"})
      } else {
        res.json({success: false, msg: "Vote failed..."})
      }
    })
  })
})

router.delete('/', passport.authenticate('gaia', {session:false}), (req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    Question.deleteAll((err, deleted) => {
      if (deleted) {
        res.json({success: true, msg: 'Successfully deleted all questions'})
      } else {
        res.json({success: false, msg: 'Something went wrong.'})
      }
    })
  }
})

router.get('/:questionURL', (req, res, next) => {
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
        } else {
          res.json({success: false, msg: "Couldn't update question views."})
        }
      })
    } else {
      res.json({success: false, msg: "Couldn't get question by _id."});
    }
  })
})

router.get('', (req, res, next) => {
  Question.find().sort({'_id': -1}).exec(function(err, docs){
    if (err) throw err;
    if (docs){
      res.json({success: true, questions: docs})
    } else {
      res.json({success: false, msg: "Couldn't find any questions...maybe ask a few!"})
    }
  })
})

router.get('/:questionURL/answers', (req, res, next) => {
  Answer.getAnswersByQuestionURL(req.params.questionURL, (err, answers) => {
    if (err) throw err;
    if (answers){
      res.json({success: true, answers: answers})
    } else {
      res.json({success: false, msg: "Couldn't find any answers, maybe go write one!"})
    }
  })
})

router.get('/:questionid/answers/votes/:userid', (req, res, next) => {
  Vote.find({questionid: req.params.questionid, userid: req.params.userid}, (err, votes) => {
    if (err) throw err;
    if (votes.length){
      res.json({success: true, votes: votes})
    } else {
      res.json({success: false, msg: "Could not get votes from questionid"})
    }
  })
})

router.post('/:questionURL/answers/add', passport.authenticate('jwt', {session:false}), (req, res, next) => {
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
  Question.addAnswerToQuestion(req.params.questionURL, (err, question) => {
    if (question) {
      Answer.addAnswer(answer, (err, savedAnswer) => {
        if (err) throw err;
        if (savedAnswer) {
          res.json({success: true, msg: "Answer has been added!", answer: savedAnswer})
        } else {
          res.json({success: false, msg: "Answer couldn't be added for some reason."})
        }
      })
    } else {
      res.json({success: false, msg: 'Couldn\'t find question...'})
    }
  })
})

router.delete('/:questionURL/answers/:answerID', passport.authenticate('jwt', {session:false}), (req, res, next) => {
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
})

module.exports = router;
