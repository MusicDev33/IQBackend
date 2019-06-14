const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require("../config/database");

const UserSchema = mongoose.Schema({
  fbTokens: {
    type: Array
  },
  name: {
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
  }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(mongoID, callback){
  User.findById(mongoID, callback);
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
