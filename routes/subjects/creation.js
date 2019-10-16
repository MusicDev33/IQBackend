const modPath = require('../modelpath')
const modelPath = modPath.MODEL_PATH;
const Subject = require(modelPath + 'subjectmodel')

const StringUtils = require('../../ProtoChanges/string')

module.exports.createSubject = function(req, res, next) {
  if (req.params.subjectname.length < 3) {
    return res.json({success: false, msg: 'Subject name is too short'});
  }

  if (!req.params.subjectname.match(/^[a-zA-Z0-9\-']+$/g)) {
    return res.json({success: false, msg: "Subject names are alphanumeric (and may contain dashes and apostrophes)"})
  }

  // Still not sure what the cutoff should be
  if (req.params.subjectname.length > 35) {
    return res.json({success: false, msg: 'Subject name is too long'});
  }

  let subjectName = StringUtils.titleCase(req.params.subjectname.trim())
  subjectName = subjectName.replace(/-/g, ' '); // replaces dashes with spaces
  const subjectURL = Subject.subjectNameToURL(subjectName)
  const newSubject = new Subject({
    name: subjectName,
    followers: 0,
    subjectURL: subjectURL,
    views: 0
  })

  Subject.findOne({name: subjectName}, (err, subject) => {
    if (err) throw err;
    if (!subject) {
      Subject.addSubject(newSubject, (err, subject) => {
        if (err) throw err;
        if (subject){
          res.json({success: true, msg: "Subject added!", subject: subject});
        } else {
          res.json({success: false, msg: "Subject could not be added..."});
        }
      })
    } else {
      res.json({success: false, msg: "This topic already exists!", subject: subject});
    }
  })
}
