const mongoose = require('mongoose');

const EditLogSchema = mongoose.Schema({
  contentID: { // ID of the content: questionID, answerID, etc...
    type: String
  },
  userID: { // User who made the edit
    type: String
  },
  paidContent: {
    type: Boolean
  },
  editType: {
    type: String
  }
});

const EditLog = module.exports = mongoose.model('EditLog', EditLogSchema);

module.exports.createLog = function(editLog, callback) {
  editLog.save((err, savedLog) => {
    if (err) throw err;
    if (savedLog) {
      callback(null, savedLog);
    } else {
      callback(null, null);
    }
  })
}
