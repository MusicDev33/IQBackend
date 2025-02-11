const mongoose = require('mongoose');
const StringUtils = require('../ProtoChanges/string');

const SubjectSchema = mongoose.Schema({
  name: {
    type: String
  },
  followers: {
    type: Number
  },
  questions: {
    type: Number
  },
  posterID: {
    type: String
  },
  views: {
    type: String
  },
  subjectURL:{
    type: String
  },
  type: {
    type: String,
    default: 'subject'
  }
});

const Subject = module.exports = mongoose.model('Subject', SubjectSchema);

// Keeping this separated from the source search for the time being
module.exports.searchByName = function(searchTerm, callback) {
  const regexp = '^' + searchTerm;
  Subject.find({ subjectURL: {$regex : regexp, $options: 'i'}}).lean().exec((err, subjects) => {
    if (err) throw err;
    // Will return an array, regardless of whether or not it's empty
    if (subjects) {
      callback(null, subjects);
    } else {
      callback(null, null);
    }
  });
}

// Maybe move this to a real utility file
module.exports.subjectNameToURL = function(subjectText){
  let urlText = ""
  const specialChars = "!@#$%^&*()>< '"

  for (let i = 0; i < subjectText.length; i++) {
    if (specialChars.indexOf(subjectText[i]) > -1){
      urlText += "-"
    }else if (subjectText[i] == "?"){

    }else{
      urlText += subjectText[i]
    }
  }
  return urlText
}

module.exports.findByName = function(subject, callback){
  Subject.findOne({name: subject}, (err, foundSubject) => {
    if (err) throw err;
    if (foundSubject){
      callback(null, foundSubject)
    }else{
      callback(null, null)
    }
  })
}

module.exports.addFollower = function(subject, newCount, callback){ // poorly named...I know...
  Subject.findOneAndUpdate({name: subject},
    {followers: newCount},
    {new: true}, (err, updatedSubject) => {
      if (err) throw err;
      if (updatedSubject){
        callback(null, updatedSubject);
      }else{
        callback(null, null)
      }
  })
}

module.exports.removeFollower = function(subjectName, callback){
  Subject.findOne({name: subjectName}, (err, subject) => {
    if (err) throw err;
    if (subject){
      Subject.findOneAndUpdate({name: subject.name},
        {followers: subject.followers - 1},
        {new: true}, (err, updatedSubject) => {
          if (err) throw err;
          if (updatedSubject){
            callback(null, updatedSubject);
          }else{
            console.log(1)
            callback(null, null)
          }
      })
    } else {
      console.log(2)
      callback(null, null)
    }
  })
}

module.exports.addSubject = function(subject, callback){
  subject.save(callback)
}
