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
