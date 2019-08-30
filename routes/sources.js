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
const Source = require('../models/sourcemodel')

router.post('add', (req, res, next) => {
  const body = req.body;
  const newSource = new Source({
    name: body.name,
    follower: 0,
    posterID: body.posterID,
    views: 0,
    sourceURL: Source.sourceTextToURL(body.name), // Use a function to create this
    tags: [],
    edition: body.edition
  })

  Source.saveSource(newSource, (err, savedSource) => {
    if (savedSource) {
      res.json({success: true, msg: 'Successfully saved source!'});
    } else {
      res.json({success: false, msg: 'Couldn\t save source.'})
    }
  });
});

router.delete(':sourcetext', (req, res, next) => {
  
})

module.exports = router;
