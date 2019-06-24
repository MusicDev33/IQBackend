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
router.post('/register', (req, res, next) => {
  // Ugh, nested ifs AND callbacks. Can you think of anything worse?
  // P.S. Maybe I just suck at writing decent code...

  if (req.body.handle.indexOf(' ') >= 0){
    return res.json({success: false, msg: "You can't have spaces in your handle."})
  }

  User.getUserByHandle(req.body.handle, (err, user) => {
    if (err) throw err;
    if (user){
      res.json({success: false, msg: "There's already a user by that name!"});
    }else{
      User.getUserByEmail(req.body.email, (err, user) => {
        if (err) throw err;
        if (user){
          res.json({success: false, msg: "This email is already associated with an account."})
        }else{
          let newUser = new User({
            fbTokens: [],
            name: req.body.firstName + " " + req.body.lastName,
            email: req.body.email,
            handle: req.body.handle,
            phoneNumber: req.body.phoneNumber,
            password: req.body.password,
            profileImage: "",
            customization: {}
          });

          User.addUser(newUser, (err, user) => {
            messages = ["Error on registering user.", "User " + user.name + " successfully registered!"]
            res.json(AutoRes.AutoResC2(err, user, messages));
          });
        }
      })
    }
  })
});

router.post('/authenticate', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password

  User.getUserByEmail(email, (err, user) => {
    if (err) throw err;
    if (!user){
      res.json({success: false, msg: "Couldn't find user, sorry bro."});
    }else{
      User.comparePassword(password, user.password, (err, isMatch) => {
        if(err) throw err;
        if (!isMatch) {
          res.json({success: false, msg: "Wrong password!!!%!#%$^"})
        }else{
          const jwtToken = jwt.sign(user.toJSON(), config.secret, {
            expiresIn: 28800 // 8 hours
          });

          res.json({
            success: true,
            token: "JWT " + jwtToken,
            user: {
              id: user._id,
              name: user.name,
              phoneNumber: user.phoneNumber,
              handle: user.handle
            }

          })
        }
      })
    }

  })
});

router.get('/profile/:handle', (req, res, next) => {
  User.getUserByHandle(req.params.handle, (err, user) => {
    if (err) throw err;
    if (user){
      var returnUser = new User({
        _id: user._id,
        name: user.name,
        handle: user.handle,
        profileImage: user.profileImage,
        customization: user.customization,
        credentials: user.credentials,
        bio: user.bio
      })
      res.json({success: true, msg: "Successfully found user.", user: returnUser})
    }else{
      res.json({success: false, msg: "Couldn't find user by handle."})
    }
  })
});

router.get('/:userid/questions', (req, res, next) => {
  console.log("Questions requested.");
  console.log(req.params.userid)
  Question.find({askerID: req.params.userid}, (err, questions) => {
    if (err) throw err;
    if (questions){
      res.json({success: true, msg: "Successfully found questions.", questions: questions})
    }else{
      res.json({success: false, msg: "Couldn't find user's questions."})
    }
  })
});

router.get('/:userid/answers', (req, res, next) => {
  Answer.find({posterID: req.params.userid}, (err, answers) => {
    if (err) throw err;
    if (answers){
      res.json({success: true, msg: "Successfully found answers.", answers: answers})
    }else{
      res.json({success: false, msg: "Couldn't find user's answers."})
    }
  })
});

router.get('/profile', passport.authenticate('jwt', {session:false}),(req, res, next) => {
  res.json({user: req.user})
})

module.exports = router;
