const modPath = require('../modelpath')
const modelPath = modPath.MODEL_PATH;
const EditLog = require(modelPath + 'editlogmodel');

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
