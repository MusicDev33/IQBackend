const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');
const passport = require('passport')
const jwt = require('jsonwebtoken')
const modPath = require('../modelpath')
const StringUtils = require('../../ProtoChanges/string')
const config = require('../../config/database')

const modelPath = modPath.MODEL_PATH;
const User = require(modelPath + 'usermodel')
const Question = require(modelPath + 'questionmodel')
const Source = require(modelPath + 'sourcemodel')
const Subject = require(modelPath + 'subjectmodel')

// REWRITE
router.get('/everything/:searchterm', (req, res, next) => {
  const searchTerm = req.params.searchterm.replace(/[-]+/, ' ');
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
