const express = require('express')
const router = express.Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const AutoRes = require('../../RouteUtils/autores')
const config = require('../../config/database')
const StringUtils = require('../../ProtoChanges/string')
const Location = require('../../models/locationmodel')
const rateLimit = require('express-rate-limit');

const modPath = require('../modelpath')
const modelPath = modPath.MODEL_PATH;
const User = require(modelPath + 'usermodel')
const Question = require(modelPath + 'questionmodel')
const Source = require(modelPath + 'sourcemodel')
const Subject = require(modelPath + 'subjectmodel')

const UserModule = require('./usermodule')

// Register
router.post('/register', UserModule.registerLimit, UserModule.registerUser);

// Authentication
router.post('/authenticate', UserModule.authLimit, UserModule.authorizeUser);

// User follows subject
router.post('/:userid/subjects/:subjectname', (req, res, next) => {
  let subjectName = StringUtils.titleCase(req.params.subjectname.trim())
  subjectName = subjectName.replace(/-/g, ' '); // replaces dashes with spaces
  Subject.findByName(subjectName, (err, subject) => {
    if (subject){
      User.addSubject(req.params.userid, subject.name, (err, updatedUser) => {
        if (updatedUser){
          Subject.addFollower(subject.name, subject.followers + 1, (err, updatedSubject) => {
            if (updatedSubject){
              res.json({success: true, subject: updatedSubject})
            } else {
              res.json({success: false, msg: "Something didn't happen...."})
            }
          })
        }
      })
    } else {
      return res.json({success: false, msg: "Couldn't find subject, make sure it exists!"})
    }
  })
});

// User unfollows subject
router.delete('/:userid/subjects/:subjectname', (req, res, next) => {
  let subjectName = StringUtils.titleCase(req.params.subjectname.trim())
  subjectName = subjectName.replace(/-/g, ' '); // replaces dashes with spaces
  User.removeSubject(req.params.userid, subjectName, (err, user) => {
    if (user){
      Subject.removeFollower(subjectName, (err, subject) => {
        if (subject){
          res.json({success: true, user: user});
        } else {
          res.json({success: true, user: user, msg: "Couldn't update follower count."})
        }
      })
    } else {
      res.json({success: false, msg: "Failed for one of many reasons."})
    }
  })
})

// User follows source
router.post('/:userid/sources/:sourcename', (req, res, next) => {
  let sourceName = req.params.sourcename.trim();
  sourceName = sourceName.replace(/-/g, ' ');
  console.log(sourceName)
  Source.findByName(sourceName, (err, source) => {
    if (source) {
      User.addSource(req.params.userid, source.name, (err, updatedUser) => {
        console.log(source.followers)
        if (updatedUser){
          console.log('cool')
          Source.addFollower(source.name, source.followers + 1, (err, updatedSource) => {
            if (updatedSource){
              res.json({success: true, source: updatedSource});
            } else {
              res.json({success: false, msg: "Failed to update source."});
            }
          })
        } else {
          res.json({success: false, msg: "Failed to update user."})
        }
      })
    } else {
      res.json({success: false, msg: 'Couldn\'t find source...'})
    }
  })
})

router.delete('/:userid/sources/:sourcename', (req, res, next) => {
  let sourceName = StringUtils.titleCase(req.params.sourcename.trim())
  sourceName = sourceName.replace(/-/g, ' '); // replaces dashes with spaces
  User.removeSubject(req.params.userid, sourceName, (err, user) => {
    if (user){
      Source.removeFollower(sourceName, (err, source) => {
        if (source){
          res.json({success: true, user: user});
        } else {
          res.json({success: true, user: user, msg: "Couldn't update follower count."})
        }
      })
    } else {
      res.json({success: false, msg: "Failed for one of many reasons."})
    }
  })
})

router.get('/profile/:handle', (req, res, next) => {
  User.getUserByHandle(req.params.handle, (err, user) => {
    if (err) throw err;
    if (user){
      user.password = '';
      console.log("Profile")
      console.log(user)
      res.json({success: true, msg: "Successfully found user.", user: user})
    } else {
      res.json({success: false, msg: "Couldn't find user by handle."})
    }
  })
});

router.get('/:userid/questions', (req, res, next) => {
  Question.find({askerID: req.params.userid}).sort({_id: -1}).exec((err, questions) => {
    if (err) throw err;
    if (questions){
      res.json({success: true, msg: "Successfully found questions.", questions: questions})
    } else {
      res.json({success: false, msg: "Couldn't find user's questions."})
    }
  })
});

router.get('/:userid/answers', (req, res, next) => {
  Answer.find({posterID: req.params.userid}).sort({_id: -1}).exec((err, answers) => {
    if (err) throw err;
    if (answers){
      res.json({success: true, msg: "Successfully found answers.", answers: answers})
    } else {
      res.json({success: false, msg: "Couldn't find user's answers."})
    }
  })
});

router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  req.user.password = '';
  res.json({success: true, user: req.user});
});

router.post('/:userid/knowledge/:subject', (req, res, next) => {
  console.log('Add knowledge');
  User.addKnowledge(req.params.userid, StringUtils.urlToName(req.params.subject), (err, savedUser) => {
    if (savedUser) {
      console.log('Added knowledge');
      res.json({success: true, msg: "Add subject to user knowledge"})
    } else {
      res.json({success: false, msg: 'Couldn\'t add subject to user knowledge'})
    }
  })
})

router.post('/:userid/bio', (req, res, next) => {
  User.changeBio(req.params.userid, req.body.bio, (err, updatedUser) => {
    if (updatedUser) {
      res.json({success: true, msg: 'Changed bio!'});
    } else {
      res.json({success: false, msg: 'Couldn\'t change bio...'});
    }
  });
});

router.delete('/:userid/knowledge/:subject', (req, res, next) => {
  User.deleteKnowledge(req.params.userid, StringUtils.urlToName(req.params.subject), (err, savedUser) => {
    if (savedUser) {
      res.json({success: true, msg: "Deleted subject from user knowledge"})
    } else {
      res.json({success: false, msg: 'Couldn\'t delete subject from user knowledge'})
    }
  })
})

router.put('/:userid/knowledge', (req, res, next) => {
  User.deleteKnowledge(req.params.userid, req.body.knowledge, (err, savedUser) => {
    if (savedUser) {
      res.json({success: true, msg: "Successfully updated user"})
    } else {
      res.json({success: false, msg: 'Couldn\'t update user'})
    }
  })
})

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
    } else {
      res.json({success: false, msg: "Couldn't collect anonymous location data."})
    }
  })
});

module.exports = router;
