const modPath = require('../modelpath')
const modelPath = modPath.MODEL_PATH;
const Subject = require(modelPath + 'subjectmodel')

module.exports.searchSubject = function(req, res, next) {
  Subject.searchByName(req.params.searchterms.substring(0, 39), (err, subjects) => {
    if (subjects.length) {
      res.json({success: true, subjects: subjects});
    } else {
      res.json({success: false, msg: 'Couldn\'t find any subjects based on your search terms...', subjects: []});
    }
  })
}
