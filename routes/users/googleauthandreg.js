const jwt = require('jsonwebtoken')
const config = require('../../config/database')
const rateLimit = require('express-rate-limit')

const modPath = require('../modelpath')
const modelPath = modPath.MODEL_PATH;
const User = require(modelPath + 'usermodel')

module.exports.googleRegisterUser = function(req, res, next) {
  console.log('TEST')
  if (req.body.handle.indexOf(' ') >= 0 || !req.body.handle.match(/^[a-z0-9_]+$/g)){
    return res.json({success: false, msg: "You can't have special characters in your handle. Letters must be lowercase."})
  }

  User.getUserByHandle(req.body.handle, (err, userWithHandle) => {
    if (userWithHandle){
      return res.json({success: false, msg: "There's already a user by that name!"});
    } else {
      User.getUserByEmail(req.body.email, (err, userWithEmail) => {
        if (userWithEmail){
          return res.json({success: false, msg: "This email is already associated with an account."})
        } else {
          let newUser = new User({
            fbTokens: [],
            name: req.body.name,
            email: req.body.email.toLowerCase(),
            handle: req.body.handle,
            phoneNumber: '',
            password: '',
            bio: "",
            profileImage: req.body.photoUrl,
            customization: {},
            currentSubjects: [],
            currentSources: [],
            profileHits: 0,
            knowledge: {},
            googleID: req.body.googleID
          });

          User.addUserGoogle(newUser, (err, user) => {
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

module.exports.googleAuthUser = function(req, res, next) {
  User.getByGoogleID(req.body.googleID, (err, user) => {
    if (user) {
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
    } else {
      return res.json({success: false, msg: 'Couldn\'t log in'})
    }
  });
}
