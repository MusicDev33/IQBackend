const express = require('express')
const router = express.Router()
const passport = require('passport')

const FeedbackModule = require('./feedbackmodule')

router.post('/add', FeedbackModule.addFeedback);

module.exports = router;
