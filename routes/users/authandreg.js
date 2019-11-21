const jwt = require('jsonwebtoken')
const config = require('../../config/database')
const rateLimit = require('express-rate-limit')

const modPath = require('../modelpath')
const modelPath = modPath.MODEL_PATH;
const User = require(modelPath + 'usermodel')

// Rate Limits
module.exports.registerLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 100, // start blocking after 100 requests
  message:
    "Too many accounts created from this IP, please try again after an hour"
});

module.exports.authLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // start blocking after 10 requests
  message:
    "Too many login attempts have been made"
});

module.exports.registerUser = function(req, res, next) {
  // Ugh, nested ifs AND callbacks. Can you think of anything worse?
  // P.S. Maybe I just suck at writing decent code...

  if (req.body.handle.indexOf(' ') >= 0 || !req.body.handle.match(/^[a-z0-9_]+$/g)){
    return res.json({success: false, msg: "You can't have special characters in your handle. Letters must be lowercase."})
  }

  if (!req.body.firstName.match(/^[a-zA-Z0-9_\-']+$/g) || !req.body.lastName.match(/^[a-zA-Z0-9_\-']+$/g)) {
    return res.json({success: false, msg: "You can't have special characters in your name."})
  }

  if (req.body.phoneNumber && !req.body.phoneNumber.match(/^[0-9\-]+$/g)) {
    return res.json({success: false, msg: "You can only have numbers in your phone number."})
  }

  if (req.body.password.length < 8) {
    return res.json({success: false, msg: 'Your password must have 8 characters in it!'})
  }

  User.getUserByHandle(req.body.handle, (err, user) => {
    if (err) throw err;
    if (user){
      return res.json({success: false, msg: "There's already a user by that name!"});
    } else {
      User.getUserByEmail(req.body.email, (err, user) => {
        if (err) throw err;
        if (user){
          return res.json({success: false, msg: "This email is already associated with an account."})
        } else {
          let newUser = new User({
            fbTokens: [],
            name: req.body.firstName + " " + req.body.lastName,
            email: req.body.email.toLowerCase(),
            handle: req.body.handle,
            phoneNumber: req.body.phoneNumber,
            password: req.body.password,
            bio: "",
            profileImage: "",
            customization: {},
            currentSubjects: [],
            currentSources: [],
            profileHits: 0,
            knowledge: {},
            googleID: ''
          });

          User.addUser(newUser, (err, user) => {
            if (err) throw err;
            if (user) {
              return res.json({success: true, msg: 'User registered!'})
            } else {
              return res.json({success: false, msg: 'Something went wrong!'})
            }
          });
        }
      });
    }
  });
}

module.exports.authorizeUser = function(req, res, next) {
  const login = req.body.login.toLowerCase();
  const password = req.body.password
  User.getUserByLogin(login, (err, user) => {
    if (err) throw err;
    if (!user){
      return res.json({success: false, msg: "User doesn't exist. Creating an account can fix that."});
    } else {
      if (user.googleID.length) {
        return res.json({success: false, msg: 'Wrong password!'});
      }
      User.comparePassword(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (!isMatch) {
          return res.json({success: false, msg: "Wrong password!"})
        } else {
          user.password = '';
          const jwtToken = jwt.sign(user.toJSON(), config.secret, {
            expiresIn: 28800 // 8 hours
          });

          return res.json({
            success: true,
            token: "JWT " + jwtToken,
            user: {
              id: user._id,
              name: user.name,
              phoneNumber: user.phoneNumber,
              handle: user.handle,
              customization: user.customization
            }
          });
        }
      });
    }
  });
}
