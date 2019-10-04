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
    type: Object
  }
}, { minimize: false });

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

module.exports.changeBio = function(mongoID, bio, callback) {
  User.findById(mongoID, (err, user) => {
    if (err) throw err;
    if (user) {
      user.bio = bio;
      user.markModified('bio');
      user.save((err, updatedUser) => {
        if (err) throw err;
        if (updatedUser) {
          callback(null, updatedUser);
        } else {
          callback(null, null);
        }
      })
    } else {
      callback(null, null);
    }
  })
}

module.exports.getUserByEmail = function(email, callback){
  User.findOne({email: email}, (err, user) => {
    if (err) callback(err, null)
    if (!user){
      callback(null, null);
    } else {
      callback(null, user);
    }
  })
}

module.exports.getUserByHandle = function(handle, callback){
  User.findOne({handle: handle}, (err, user) => {
    if (err) callback(err, null)
    if (!user){
      callback(null, null);
    } else {
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

module.exports.addKnowledge = function(userid, subject, callback) {
  User.findById(userid, (err, user) => {
    if (err) throw err;
    if (user) {
      const knowledgeSubjects = Object.values(user.knowledge);
      const numSubjects = knowledgeSubjects.length + 1;
      if (!knowledgeSubjects.includes(subject)) {
        user.knowledge[numSubjects.toString()] = subject;
        console.log(user.knowledge)
        user.markModified('knowledge');
        user.save((err, updatedUser) => {
          if (err) throw err;
          console.log(updatedUser);
          return callback(null, updatedUser);
        })
      } else {
        callback(null, null);
      }
    } else {
      callback(null, null);
    }
  })
}

module.exports.deleteKnowledge = function(userid, subjectName, callback) {
  User.findById(userid, (err, user) => {
    if (err) throw err;
    if (user) {
      let knowledgeSubjects = Object.values(user.knowledge);
      knowledgeSubjects = knowledgeSubjects.filter(subject => subject !== subjectName);
      let knowledgeObject = {};
      for (i = 1; i < knowledgeSubjects.length+1; i++) {
        knowledgeObject[i.toString()] = knowledgeSubjects[i-1];
      }
      user.knowledge = knowledgeObject;
      user.markModified('knowledge');
      user.save((err, updatedUser) => {
        if (err) throw err;
        return callback(null, updatedUser);
      })
    } else {
      callback(null, null);
    }
  })
}

module.exports.updateKnowledge = function(userid, knowledgeObject, callback) {
  User.findById(userid, (err, user) => {
    if (err) throw err;
    if (user) {
      user.knowledge = knowledgeObject;
      user.markModified('knowledge');
      user.save((err, updatedUser) => {
        if (err) throw err;
        return callback(null, updatedUser);
      })
    } else {
      callback(null, null);
    }
  })
}

module.exports.addSubject = function(userid, subject, callback){
  User.findById(userid, (err, user) => {
    if (user) {
      if (!user.currentSubjects.includes(subject)) {
        user.currentSubjects.push(subject)
        user.save((err, updatedUser) => {
          if (err) throw err;
          return callback(null, updatedUser)
        })
      } else {
        return callback(null, null)
      }
    } else {
      return callback(null, null)
    }
  })
}

module.exports.removeSubject = function(userid, subject, callback){
  User.findOne({_id: userid}, (err, user) => {
    if (err) throw err;
    if (user){
      if (!user.currentSubjects.includes(subject)){
        return callback(null, null)
      } else {
        const userSubjects = user.currentSubjects;
        userSubjects.splice(user.currentSubjects.indexOf(subject), 1);
        User.findOneAndUpdate(
          {_id: userid},
          {currentSubjects: userSubjects}, {new: true}, (err, updatedUser) => {
            if (err) throw err;
            if (updatedUser){
              return callback(null, updatedUser);
            } else {
              return callback(null, null)
            }
          })
      }
    } else {
      return callback(null, null);
    }
  })
}

module.exports.addSource = function(userid, source, callback) {
  User.findById(userid, (err, user) => {
    if (err) throw err;
    if (user) {
      console.log(user.currentSources)
      console.log(source)
      if (!user.currentSources.includes(source)){
        console.log('hi')
        user.currentSources.push(source)
        user.markModified('currentSources');
        user.save((err, updatedUser) => {
          if (err) throw err;
          return callback(null, updatedUser);
        })
      } else {
        return callback(null, null);
      }
    } else {
      return callback(null, null);
    }
  })
}

module.exports.searchByName = function(searchTerm, callback) {
  const regexp = '^' + StringUtils.sanitize(searchTerm);
  User.find({ name: {$regex : regexp, $options: 'i'}}).lean().exec((err, users) => {
    if (err) throw err;
    // Will return an array, regardless of whether or not it's empty
    if (users) {
      let returnUsers = [];
      users.forEach(user => {
        const userObj = {name: user.name, handle: user.handle}
        returnUsers.push(userObj);
      })
      callback(null, returnUsers);
    } else {
      callback(null, null);
    }
  });
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
