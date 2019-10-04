const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');
const User = require('../../models/usermodel')
const Question = require('../../models/questionmodel')
const Source = require('../../models/sourcemodel')
const Subject = require('../../models/subjectmodel')
const Answer = require('../../models/answermodel')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const AutoRes = require('../../RouteUtils/autores')
const config = require('../../config/database')
const StringUtils = require('../../ProtoChanges/string')

// REWRITE
router.get('/everything/:searchterm', (req, res, next) => {
  const searchTerm = req.params.searchterm;
  User.searchByName(searchTerm, (err, users) => {
    Source.searchByName(searchTerm, (err, sources) => {
      Subject.searchByName(searchTerm, (err, subjects) => {
        Question.searchByName(searchTerm, (err, questions) => {
          if (subjects && sources && users && questions) {
            res.json({success: true, subjects: subjects, sources: sources, users: users, questions: questions})
          } else {
            res.json({success: false, subjects: [], sources: [], users: [], questions: []})
          }
        })
      })
    })
  })
})

module.exports = router;
