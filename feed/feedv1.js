/*
This will be the feed algorithm. Its primary goals are

A) Making sure questions show up in people's feeds to be answered
B) Showing questions/answers in chronological order based on where the user is at
in their curriculum
C) Possibly showing random answers based on interest in a topic

These are ordered in importance, with most important being at the top
*/

const User = require('../models/usermodel')
const Question = require('../models/questionmodel')
const Answer = require('../models/answermodel')
const Subject = require('../models/subjectmodel')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const AutoRes = require('../RouteUtils/autores')
const Vote = require('../models/votemodel')

module.exports.getFeed = function(userID, callback) {
  User.findById(userID, (err, user) => {
    if (err) throw err;
    // Check if knowledge object has keys
    if (user && Object.keys(user.knowledge).length !== 0 && user.knowledge.constructor === Object) {
      Question.find({subject: user.knowledge["1"]}).sort({_id: -1}).limit(30).exec((err, questions) => {
        if (err) throw err;
        if (questions) {
          callback(null, questions)
        } else {
          callback(null, null)
        }
      })
    } else {
      callback(null, null)
    }
  })
}
