const mongoose = require('mongoose');

const FeedbackSchema = mongoose.Schema({
  userHandle: {
    type: String
  },
  userName: {
    type: String
  },
  feedback: {
    type: String
  },
  type: {
    type: String
  }
});

const Feedback = module.exports = mongoose.model('Feedback', FeedbackSchema);

module.exports.addFeedback = function(feedback, callback) {
  feedback.save((err, saved) => {
    if (err) throw err;
    if (saved) {
      callback(null, saved);
    }
  })
}
