const mongoose = require('mongoose');

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
  }
});

const Subject = module.exports = mongoose.model('Subject', SubjectSchema);

// Maybe move this to a real utility file
module.exports.subjectNameToURL = function(subjectText){
  var urlText = ""
  var subjectText = subjectText
  var specialChars = "!@#$%^&*()>< '"

  for (var i = 0; i < subjectText.length; i++) {
    if (specialChars.indexOf(subjectText[i]) > -1){
      urlText += "-"
    }else if (subjectText[i] == "?"){

    }else{
      urlText += subjectText[i]
    }
  }
  return urlText
}

module.exports.addFollower = function(subject, newCount, callback){
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

module.exports.addSubject = function(subject, callback){
  subject.save(callback)
}
