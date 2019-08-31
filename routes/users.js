const express = require('express')
const router = express.Router()
const User = require('../models/usermodel')
const Question = require('../models/questionmodel')
const Answer = require('../models/answermodel')
const Subject = require('../models/subjectmodel')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const AutoRes = require('../RouteUtils/autores')
const config = require('../config/database')
const StringUtils = require('../ProtoChanges/string')
const Location = require('../models/locationmodel')
const rateLimit = require('express-rate-limit');

//Register
const accountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 10, // start blocking after 5 requests
  message:
    "Too many accounts created from this IP, please try again after an hour"
});

router.post('/register', accountLimiter, (req, res, next) => {
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
            customization: {},
            currentSubjects: [],
            currentSources: [],
            profileHits: 0
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

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // start blocking after 10 requests
  message:
    "Too many login attempts have been made"
});

router.post('/authenticate', loginLimiter, (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password
  console.log(req.ip)
  User.getUserByEmail(email, (err, user) => {
    if (err) throw err;
    if (!user){
      res.json({success: false, msg: "Couldn't find user, sorry bro."});
    }else{
      User.comparePassword(password, user.password, (err, isMatch) => {
        if(err) throw err;
        if (!isMatch) {
          res.json({success: false, msg: "Wrong password!"})
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

// User follows subject
router.post('/:userid/subjects/:subjectname', (req, res, next) => {
  console.log("Log")
  var subjectName = StringUtils.titleCase(req.params.subjectname.trim())
  subjectName = subjectName.replace(/-/g, ' '); // replaces dashes with spaces
  Subject.findByName(subjectName, (err, subject) => {
    if(subject){
      User.addSubject(req.params.userid, subject.name, (err, updatedUser) => {
        if (updatedUser){
          Subject.addFollower(subject.name, subject.followers + 1, (err, updatedSubject) => {
            if (updatedSubject){
              res.json({success: true, subject: updatedSubject})
            }else{
              res.json({success: false, msg: "Something didn't happen...."})
            }
          })
        }
      })
    }else{
      return res.json({success: false, msg: "Couldn't find subject, make sure it exists!"})
    }
  })
});

// User unfollows subject
router.delete('/:userid/subjects/:subjectname', (req, res, next) => {
  var subjectName = StringUtils.titleCase(req.params.subjectname.trim())
  subjectName = subjectName.replace(/-/g, ' '); // replaces dashes with spaces
  User.removeSubject(req.params.userid, subjectName, (err, user) => {
    if (user){
      Subject.removeFollower(subjectName, (err, subject) => {
        if (subject){
          res.json({success: true, user: user});
        }else{
          res.json({success: true, user: user, msg: "Couldn't update follower count."})
        }
      })
    }else{
      res.json({success: false, msg: "Failed for one of many reasons."})
    }
  })
})



router.get('/profile/:handle', (req, res, next) => {
  User.getUserByHandle(req.params.handle, (err, user) => {
    if (err) throw err;
    if (user){
      user.password = ""
      res.json({success: true, msg: "Successfully found user.", user: user})
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
  req.user.password = ""
  res.json({user: req.user})
});

router.post('/location/add', (req, res, next) => {
  const newLocation = new Location({
    city: req.body.city,
    continent_code: req.body.continent_code,
    continent_name: req.body.continent_name,
    country_code: req.body.country_code,
    country_name: req.body.country_name,
    ip: req.body.ip,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    region_code: req.body.region_code,
    region_name: req.body.region,
    zip: req.body.zip
  })
  Location.addLocation(newLocation, (err, location) => {
    if (err) throw err;
    if (location){
      res.json({success: true, msg: "Anonymous location data sent."})
    }else{
      res.json({success: false, msg: "Couldn't collect anonymous location data."})
    }
  })
});

module.exports = router;
