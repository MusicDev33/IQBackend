const StringUtils = require('../../ProtoChanges/string')

const modPath = require('../modelpath')
const modelPath = modPath.MODEL_PATH;
const User = require(modelPath + 'usermodel')
const Source = require(modelPath + 'sourcemodel')

module.exports.addSource = function (req, res, next) {
  if ('' + req.user._id !== '' + req.params.userid) {
    return res.status(401).json({success: false, msg: 'Not authorized!'})
  }
  let sourceName = req.params.sourcename.trim();
  sourceName = sourceName.replace(/-/g, ' ');
  Source.findByName(sourceName, (err, source) => {
    if (source) {
      User.addSource(req.params.userid, source.name, (err, updatedUser) => {
        if (updatedUser){
          Source.addFollower(source.name, source.followers + 1, (err, updatedSource) => {
            if (updatedSource){
              return res.json({success: true, source: updatedSource});
            } else {
              return res.json({success: false, msg: "Failed to update source."});
            }
          })
        } else {
          return res.json({success: false, msg: "Failed to update user."})
        }
      })
    } else {
      return res.json({success: false, msg: 'Couldn\'t find source...'})
    }
  })
}

module.exports.removeSource = function (req, res, next) {
  if ('' + req.user._id !== '' + req.params.userid) {
    return res.status(401).json({success: false, msg: 'Not authorized!'})
  }
  let sourceName = StringUtils.titleCase(req.params.sourcename.trim())
  sourceName = sourceName.replace(/-/g, ' '); // replaces dashes with spaces
  User.removeSubject(req.params.userid, sourceName, (err, user) => {
    if (user){
      Source.removeFollower(sourceName, (err, source) => {
        if (source){
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
