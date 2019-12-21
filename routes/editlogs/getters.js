const modPath = require('../modelpath')
const modelPath = modPath.MODEL_PATH;
const EditLog = require(modelPath + 'editlogmodel');
const User = require(modelPath + 'usermodel');

module.exports.getEditLogs = function(req, res, next) {
  EditLog.find({}, (err, editLogs) => {
    if (err) throw err;
    if (editLogs) {
      return res.json({success: true, logs: editLogs});
    } else {
      return res.json({success: false, msg: 'Couldn\'t find edit logs.'});
    }
  })
}

module.exports.getPaidEditLogs = function(req, res, next) {
  EditLog.find({paidContent: true}, (err, editLogs) => {
    if (err) throw err;
    if (editLogs) {
      return res.json({success: true, logs: editLogs});
    } else {
      return res.json({success: false, msg: 'Couldn\'t find edit logs.'});
    }
  })
}

module.exports.getPaidEditLogsFromUser = function(req, res, next) {
  EditLog.find({paidContent: true, userHandle: req.params.userhandle}, (err, editLogs) => {
    if (err) throw err;
    if (editLogs) {
      return res.json({success: true, logs: editLogs});
    } else {
      return res.json({success: false, msg: 'Couldn\'t find edit logs.'});
    }
  })
}

module.exports.getCMAgents = function(req, res, next) {
  User.find({paidProgram: true}, (err, users) => {
    if (err) throw err;
    if (users) {
      return res.json({success: true, users: users});
    } else {
      return res.json({success: false, msg: 'Could not find users in paid program.'})
    }
  })
}
