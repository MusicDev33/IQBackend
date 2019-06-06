const express = require('express')
const router = express.Router()
const User = require('../models/usermodel')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const AutoRes = require('../RouteUtils/autores')
const config = require('../config/database')

//Register
router.post('/register', (req, res, next) => {
  console.log(req.body)
  let newUser = new User({
    fbTokens: [],
    name: req.body.firstName + " " + req.body.lastName,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    password: req.body.password,
    profileImage: "",
    customization: {}
  });

  User.addUser(newUser, (err, user) => {
    messages = ["Error on registering user.", "User " + user.name + " successfully registered!"]
    res.json(AutoRes.AutoResC2(err, user, messages));
  });
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
              phoneNumber: user.phoneNumber
            }

          })
        }
      })
    }

  })
});

router.get('/profile', passport.authenticate('jwt', {session:false}),(req, res, next) => {
  res.json({user: req.user})
})

module.exports = router;
