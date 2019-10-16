const modPath = require('../modelpath')
const modelPath = modPath.MODEL_PATH;
const User = require(modelPath + 'usermodel')
const Question = require(modelPath + 'questionmodel')
const Source = require(modelPath + 'sourcemodel')
const Subject = require(modelPath + 'subjectmodel')

module.exports.globalSearch = function(req, res, next) {
  const searchTerm = req.params.searchterm.replace(/[-]+/, ' ');
  User.searchByName(searchTerm, (err, users) => {
    Source.searchByName(searchTerm, (err, sources) => {
      Subject.searchByName(searchTerm, (err, subjects) => {
        Question.searchByName(searchTerm, (err, questions) => {
          if (subjects && sources && users && questions) {
            return res.json({success: true, subjects: subjects, sources: sources, users: users, questions: questions})
          } else {
            return res.json({success: false, subjects: [], sources: [], users: [], questions: []})
          }
        })
      })
    })
  })
}
