const modPath = require('../modelpath')
const modelPath = modPath.MODEL_PATH;

const Vote = require(modelPath + 'votemodel')
const Question = require(modelPath + 'questionmodel')
const Answer = require(modelPath + 'answermodel')


module.exports.createQuestion = function(req, res, next) {
  const questionURL = Question.questionTextToURL(req.body.question);

  let newQuestion = new Question({
    answers: [],
    questionText: req.body.question,
    urlText: questionURL,
    subject: req.body.subject,
    homeworkSource: req.body.source,
    asker: req.body.asker,
    askerID: req.body.askerID,
    askerHandle: req.body.askerHandle,
    votes: 1,
    views: 1,
    details: '',
    time: '',
    tags: req.body.tags ? req.body.tags : []
  });

  Question.addQuestion(newQuestion, (err, question) => {
    if (question) {
      return res.json({success: true, msg: 'Added question successfully.'});
    } else {
      return res.json({success: false, msg: 'Something went wrong...'})
    }
  });
}

// I'm just trying to keep naming consistent, I know this is awkward
module.exports.createVote = function(req, res, next) {
  Vote.addVote(req.params.userid, req.params.answerid, Number(req.body.vote), req.params.questionid, (err, newVote, oldVote) => {
    Answer.adjustVotes(req.params.answerid, newVote, oldVote, (err, newAnswer) => {
      if (newAnswer){
        return res.json({success: true, msg: "Voted successfully!"})
      } else {
        return res.json({success: false, msg: "Vote failed..."})
      }
    })
  })
}

module.exports.createAnswer = function(req, res, next) {
  let answer = new Answer({
    questionURL: req.params.questionURL,
    answerText: req.body.answerText,
    votes: 0,
    views: 1,
    poster: req.body.poster,
    posterID: req.body.posterID,
    posterHandle: req.body.posterHandle,
    questionText: req.body.questionText
  })
  Question.addAnswerToQuestion(req.params.questionURL, (err, question) => {
    if (question) {
      Answer.addAnswer(answer, (err, savedAnswer) => {
        if (err) throw err;
        if (savedAnswer) {
          res.json({success: true, msg: "Answer has been added!", answer: savedAnswer})
        } else {
          res.json({success: false, msg: "Answer couldn't be added for some reason."})
        }
      })
    } else {
      res.json({success: false, msg: 'Couldn\'t find question...'})
    }
  })
}
