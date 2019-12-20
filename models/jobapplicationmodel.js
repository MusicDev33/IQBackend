const mongoose = require('mongoose');

const JobApplicationSchema = mongoose.Schema({
  fullName: {
    type: String
  },
  email: {
    type: String
  },
  phoneNumber: {
    type: String
  },
  skillsDesc: {
    type: String
  },
  jobType: { // This will entry, Mid-Management, etc...really just to cover my ass in the future just in case.
    type: String
  },
  job: {
    type: String // This is the job - Content Management Agent, CTO, etc. Again, covering my ass for a possible future.
  }
});

const JobApplication = module.exports = mongoose.model('JobApplication', JobApplicationSchema);

module.exports.saveApplication = function(jobApp, callback) {
  jobApp.save((err, savedApp) => {
    if (err) throw err;
    if (savedApp) {
      callback(null, savedApp);
    } else {
      callback(null, null);
    }
  });
}
