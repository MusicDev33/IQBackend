const express = require('express')
const router = express.Router()
const passport = require('passport')

const QuestionModule = require('./questionmodule')

// For internal use
router.get('/developer/sitemapdata', QuestionModule.getSitemapData);

// Getters
router.get('',  QuestionModule.getAllQuestions)
router.get('/:questionURL',  QuestionModule.getQuestionByUrl)
router.get('/id/:questionid',  QuestionModule.getQuestionById)
router.get('/:questionURL/answers',  QuestionModule.getQuestionAnswers)
router.get('/:questionid/answers/votes/:userid',  QuestionModule.getAnswerVotesFromUser)

// Creation
// Find a way to make this :questionurl instead of /add
router.post('/add', passport.authenticate('jwt', {session:false}), QuestionModule.createQuestion);
router.post('/:questionid/:userid/:answerid/vote', passport.authenticate('jwt', {session:false}),  QuestionModule.createVote)
router.post('/:questionURL/answers/add', passport.authenticate('jwt', {session:false}),  QuestionModule.createAnswer)
router.put('/:questionid/answers/:answerid', passport.authenticate('jwt', {session: false}), QuestionModule.editAnswer)

// Destruction
router.delete('/', passport.authenticate('gaia', {session:false}),  QuestionModule.deleteAllQuestions)
router.delete('/:questionURL/answers/:answerID', passport.authenticate('jwt', {session:false}),  QuestionModule.deleteAnswer)

// Editing
router.put('/:questionid/tags', passport.authenticate('jwt', {session: false}), QuestionModule.editQuestionTags);
router.put('/:questionid/source', passport.authenticate('jwt', {session: false}), QuestionModule.editQuestionSource);

module.exports = router;
