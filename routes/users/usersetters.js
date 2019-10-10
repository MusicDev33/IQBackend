// This module is going to be composed
// of setters for top-level resources in the user only
const modPath = require('../modelpath')
const modelPath = modPath.MODEL_PATH;
const User = require(modelPath + 'usermodel')

module.exports.setUserBioRoute = function(req, res, next) {
  User.changeBio(req.params.userid, req.body.bio, (err, updatedUser) => {
    if (updatedUser) {
      return res.json({success: true, msg: 'Changed bio!'});
    } else {
      return res.json({success: false, msg: 'Couldn\'t change bio...'});
    }
  });
}
