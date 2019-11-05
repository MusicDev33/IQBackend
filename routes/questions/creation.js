const jwt = require('jsonwebtoken');

const modPath = require('../modelpath')
const modelPath = modPath.MODEL_PATH;

const Vote = require(modelPath + 'votemodel')
const Question = require(modelPath + 'questionmodel')
const Answer = require(modelPath + 'answermodel')


module.exports.createQuestion = function(req, res, next) {
  if ('' + req.user._id !== req.body.askerID) {
    return res.status(401).json({success: false, msg: 'Not authorized!'})
  }
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
  if ('' + req.user._id !== req.params.userid) {
    return res.status(401).json({success: false, msg: 'Not authorized!'})
  }
  Vote.addVote(req.params.userid, req.params.answerid, Number(req.body.vote), req.params.questionid, (err, newVote, oldVote) => {
    Answer.adjustVotes(req.params.answerid, newVote, oldVote, (err, newAnswer) => {
      if (newAnswer){
        Question.getQuestionByID(req.params.questionid, (err, question) => {
          if (question) {
            Answer.getAnswersByQuestionURL(question.urlText, (err, answers) => {
              const highestVoteAnswer = answers.reduce((prev, current) => {
                  if (+current.id > +prev.id) {
                      return current;
                  } else {
                      return prev;
                  }
              });

              const shortenedAnswer = {
                _id: highestVoteAnswer._id,
                answerText: highestVoteAnswer.answerText,
                poster: highestVoteAnswer.poster,
                posterID: highestVoteAnswer.posterID,
                posterHandle: highestVoteAnswer.posterHandle
              }
              if ('' + question.previewAnswer._id !== '' + highestVoteAnswer._id) {
                Question.idChangePreviewAnswer(req.params.questionid, shortenedAnswer, (err, saved) => {
                  if (saved) {
                    console.log('E.PreviewChange: QuestionID(' + req.params.questionid + '), AnswerID(' + req.params.answerid + ')')
                  }
                })
              }
            })
          }
        })
        // Question.idChangePreviewAnswer(req.params.questionid, )
        return res.json({success: true, msg: "Voted successfully!"})
      } else {
        return res.json({success: false, msg: "Vote failed..."})
      }
    })
  })
}

// This needs to be shortened...
module.exports.createAnswer = function(req, res, next) {
  if ('' + req.user._id !== req.body.posterID) {
    return res.status(401).json({success: false, msg: 'Not authorized!'})
  }
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

  const shortenedAnswer = {
    answerText: req.body.answerText,
    poster: req.body.poster,
    posterID: req.body.posterID,
    posterHandle: req.body.posterHandle
  }

  // Entry to callback hell
  Question.addAnswerToQuestion(req.params.questionURL, (err, question) => {
    if (question) {
      Answer.getAnswersByQuestionURL(req.params.questionURL, (err, answers) => {
        if (err) throw err;
        Answer.addAnswer(answer, (err, savedAnswer) => {
          if (err) throw err;
          if (savedAnswer) {
            if (!answers.length) {
              shortenedAnswer['_id'] = savedAnswer._id;
              // LOL saved is actually the old question, but I'll treat it like a boolean
              Question.changePreviewAnswer(req.params.questionURL, shortenedAnswer, (err, saved) => {
                return res.json({success: true, msg: "Answer has been added!", answer: savedAnswer});
              })
            } else {
              return res.json({success: true, msg: "Answer has been added!", answer: savedAnswer});
            }
          } else {
            return res.json({success: false, msg: "Answer couldn't be added for some reason."})
          }
        })
      })
    } else {
      return res.json({success: false, msg: 'Couldn\'t find question...'})
    }
  })
}

module.exports.editAnswer = function(req, res, next) {
  Question.getQuestionByID(req.params.questionid, (err, question) => {
    if (question) {
      if ('' + question.previewAnswer._id === '' + req.params.answerid) {
        let newAnswer = question.previewAnswer;
        newAnswer.answerText = req.body.newText;

        Question.idChangePreviewAnswer(req.params.questionid, newAnswer, (err, savedQuestion) => {})
      }
    }
  })

  Answer.getAnswerById(req.params.answerid, (err, answer) => {
    if (answer) {
      if ('' + req.user._id !== '' + answer.posterID) {
        return res.status(401).json({success: false, msg: 'Not authorized!'})
      }
      Answer.editAnswer(req.params.answerid, req.body.newText, (err, savedAnswer) => {
        if (savedAnswer) {
          return res.json({success: true, answer: savedAnswer});
        } else {
          return res.json({success: false, msg: 'Couldn\'t edit answer...'});
        }
      })
    } else {
      return res.json({success: false, msg: 'Couldn\'t find answer...'});
    }
  })
}
