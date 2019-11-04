const StringUtils = require('../../ProtoChanges/string')

const modPath = require('../modelpath')
const modelPath = modPath.MODEL_PATH;
const User = require(modelPath + 'usermodel')

module.exports.addKnowledgeRoute = function(req, res, next) {
  if ('' + req.user._id !== '' + req.params.userid) {
    return res.status(401).json({success: false, msg: 'Not authorized!'})
  }
  User.addKnowledge(req.params.userid, StringUtils.urlToName(req.params.subject), (err, savedUser) => {
    if (savedUser) {
      return res.json({success: true, msg: "Add subject to user knowledge"})
    } else {
      return res.json({success: false, msg: 'Couldn\'t add subject to user knowledge'})
    }
  })
}

module.exports.removeKnowledgeRoute = function(req, res, next) {
  if ('' + req.user._id !== '' + req.params.userid) {
    return res.status(401).json({success: false, msg: 'Not authorized!'})
  }
  User.deleteKnowledge(req.params.userid, StringUtils.urlToName(req.params.subject), (err, savedUser) => {
    if (savedUser) {
      return res.json({success: true, msg: "Deleted subject from user knowledge"})
    } else {
      return res.json({success: false, msg: 'Couldn\'t delete subject from user knowledge'})
    }
  })
}

module.exports.updateKnowledgeRoute = function(req, res, next) {
  if ('' + req.user._id !== '' + req.params.userid) {
    return res.status(401).json({success: false, msg: 'Not authorized!'})
  }
  User.updateKnowledge(req.params.userid, req.body.knowledge, (err, savedUser) => {
    if (savedUser) {
      return res.json({success: true, msg: "Successfully updated user"})
    } else {
      return res.json({success: false, msg: 'Couldn\'t update user'})
    }
  })
}
