const modPath = require('../modelpath')
const modelPath = modPath.MODEL_PATH;
const JobApplication = require(modelPath + 'jobapplicationmodel');

module.exports.sendApplication = function(req, res, next) {
  const newJobApp = new JobApplication({
    fullName: req.body.name,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    skillsDesc: req.body.skills,
    job: req.body.job,
    jobType: req.body.jobType
  });

  JobApplication.saveApplication(newJobApp, (err, savedApp) => {
    if (savedApp) {
      return res.json({success: true, msg: 'Thanks for applying!'});
    } else {
      return res.json({success: false, msg: 'Something went wrong on our end. Send an email to itsme@shelbymccowan.com if you are still interested.'});
    }
  })
}
