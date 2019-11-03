const StringUtils = require('../../ProtoChanges/string')

const modPath = require('../modelpath')
const modelPath = modPath.MODEL_PATH;
const User = require(modelPath + 'usermodel')
const Subject = require(modelPath + 'subjectmodel')

module.exports.addSubjectRoute = function (req, res, next) {
  if ('' + req.user._id !== '' + req.params.userid) {
    return res.status(401).json({success: false, msg: 'Not authorized!'})
  }
  let subjectName = StringUtils.titleCase(req.params.subjectname.trim())
  subjectName = subjectName.replace(/-/g, ' '); // replaces dashes with spaces
  Subject.findByName(subjectName, (err, subject) => {
    if (subject){
      User.addSubject(req.params.userid, subject.name, (err, updatedUser) => {
        if (updatedUser){
          Subject.addFollower(subject.name, subject.followers + 1, (err, updatedSubject) => {
            if (updatedSubject){
              return res.json({success: true, subject: updatedSubject})
            } else {
              return res.json({success: false, msg: "Something didn't happen...."})
            }
          })
        }
      })
    } else {
      return res.json({success: false, msg: "Couldn't find subject, make sure it exists!"})
    }
  })
}

module.exports.removeSubjectRoute = function (req, res, next) {
  if ('' + req.user._id !== '' + req.params.userid) {
    return res.status(401).json({success: false, msg: 'Not authorized!'})
  }
  let subjectName = StringUtils.titleCase(req.params.subjectname.trim())
  subjectName = subjectName.replace(/-/g, ' '); // replaces dashes with spaces
  User.removeSubject(req.params.userid, subjectName, (err, user) => {
    if (user){
      Subject.removeFollower(subjectName, (err, subject) => {
        if (subject){
          return res.json({success: true, user: user});
        } else {
          return res.json({success: true, user: user, msg: "Couldn't update follower count."})
        }
      })
    } else {
      return res.json({success: false, msg: "Failed for one of many reasons."})
    }
  })
}
