const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require("../config/database");
const StringUtils = require("../ProtoChanges/string")

const UserSchema = mongoose.Schema({
  fbTokens: {
    type: Array
  },
  name: {
    type: String
  },
  credentials: {
    type: Object
  },
  bio: {
    type: String
  },
  handle: {
    type: String
  },
  email: {
    type: String
  },
  phoneNumber: {
    type: String
  },
  password: {
    type: String
  },
  profileImage: {
    type: String
  },
  customization: {
    type: Object
  },
  currentSources: {
    type: Array
  },
  currentSubjects: {
    type: Array
  },
  profileHits: {
    type: Number
  },
  knowledge: {
    type: Array
  }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(mongoID, callback){
  User.findById(mongoID, (err, user) => {
    if (err) throw err; // If I throw errors here, hopefully it'll clean up the route code
    if (user){
      return callback(null, user);
    } else {
      return callback(null, null);
    }
  });
}

module.exports.getUserByEmail = function(email, callback){
  User.findOne({email: email}, (err, user) => {
    if (err) callback(err, null)
    if (!user){
      callback(null, null);
    }else{
      callback(null, user);
    }
  })
}

module.exports.getUserByHandle = function(handle, callback){
  User.findOne({handle: handle}, (err, user) => {
    if (err) callback(err, null)
    if (!user){
      callback(null, null);
    }else{
      callback(null, user);
    }
  })
}
/*
module.exports.addSubject = function(subjectArray, userid, callback){
  User.findOneAndUpdate(
    {_id: userid},
    {currentSubjects: subjectArray}, {new: true},(err, updatedUser) => {
      if (err) throw err;
      if (updatedUser){
        callback(null, updatedUser)
      }else{
        callback(null, null)
      }
    })
}*/

module.exports.addSubject = function(userid, subject, callback){
  User.findById(userid, (err, user) => {
    if (user){
      if (!user.currentSubjects.includes(subject)){
        user.currentSubjects.push(subject)
        user.save((err, updatedUser) => {
          if (err) throw err;
          return callback(null, updatedUser)
        })
      }else{
        return callback(null, null)
      }
    }else{
      return callback(null, null)
    }
  })
}

module.exports.removeSubject = function(userid, subject, callback){
  User.findOne({_id: userid}, (err, user) => {
    if (err) throw err;
    if (user){
      if (!user.currentSubjects.includes(subject)){
        console.log("1")
        return callback(null, null)
      }else{
        var userSubjects = user.currentSubjects;
        userSubjects.splice(user.currentSubjects.indexOf(subject), 1);
        User.findOneAndUpdate(
          {_id: userid},
          {currentSubjects: userSubjects}, {new: true}, (err, updatedUser) => {
            if (err) throw err;
            if (updatedUser){
              return callback(null, updatedUser);
            }else{
              console.log("1")
              return callback(null, null)
            }
          })
      }
    } else {
      return callback(null, null);
    }
  })
}

module.exports.addUser = function(newUser, callback){
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash
      newUser.save(callback)
    })
  });
}

module.exports.comparePassword = function(userPass, hash, callback){
  bcrypt.compare(userPass, hash, (err, isMatch) => {
    if (err) throw err;
    callback(null,isMatch)
  })
}
