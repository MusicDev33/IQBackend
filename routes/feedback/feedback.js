const modPath = require('../modelpath')
const modelPath = modPath.MODEL_PATH;
const Feedback = require(modelPath + 'feedbackmodel')

module.exports.addFeedback = function(req, res, next) {
  const feedbackObj = new Feedback({
    feedback: req.body.feedback,
    userHandle: req.body.userHandle,
    userName: req.body.userName,
    type: req.body.type
  });
  Feedback.addFeedback(feedbackObj, (err, savedFeedback) => {
    if (savedFeedback) {
      return res.json({success: true, msg: 'Thanks for your feedback!'})
    } else {
      return res.json({success: false, msg: 'Could not send feedback...'})
    }
  })
}
