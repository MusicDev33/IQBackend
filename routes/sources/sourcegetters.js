const mongoose = require('mongoose')

const modPath = require('../modelpath')
const modelPath = modPath.MODEL_PATH;
const Question = require(modelPath + 'questionmodel')
const Source = require(modelPath + 'sourcemodel')

const StringUtils = require('../../ProtoChanges/string')

module.exports.getAllSources = function(req, res, next) {
  Source.find({}, (err, sources) => {
    if (err) throw err;
    if (!sources) {
      return res.json({success: false, msg: 'Couldn\'t find sources'})
    } else {
      return res.json({success: true, sources: sources})
    }
  })
}

module.exports.getSourceByName = function(req, res, next) {
  const sourceName = StringUtils.urlToName(req.params.sourceurl);
  Source.findOne({name: sourceName}, (err, source) => {
    if (err) throw err;
    if (source) {
      return res.json({success: true, source: source});
    } else {
      return res.json({success: false, msg: 'Couldn\'t find source!'});
    }
  })
}

module.exports.getQuestionsFromSourceId = function(req, res, next) {
  const id = mongoose.Types.ObjectId(req.params.sourceid);
  Source.findById(id, (err, source) => {
    if (err) throw err;
    if (source) {
      Question.findBySourceName(source.name, (err, questions) => {
        if (questions){
          return res.json({success: true, questions: questions})
        } else {
          return res.json({success: false, msg: 'Couldn\'t find questions from source.'});
        }
      })
    } else {
      return res.json({success: false, msg: 'Couldn\'t find source.'})
    }
  })
}

module.exports.getQuestionsFromSourceUrl = function(req, res, next) {
  const sourceName = StringUtils.urlToName(req.params.sourceurl);
  Question.findBySourceName(sourceName, (err, questions) => {
    if (questions){
      return res.json({success: true, questions: questions})
    } else {
      return res.json({success: false, msg: 'Couldn\'t find questions from source.'});
    }
  })
}

module.exports.getSourceTags = function(req, res, next) {
  const id = mongoose.Types.ObjectId(req.params.sourceid);
  Source.findById(id, (err, source) => {
    if (err) throw err;
    if (source) {
      return res.json({success: true, tags: source.tags});
    } else {
      return res.json({success: false, msg: 'Couldn\'t find source...'});
    }
  })
}

module.exports.getQuestionsFromSourceTag = function(req, res, next) {
  const id = mongoose.Types.ObjectId(req.params.sourceid);
  Source.findById(id, (err, source) => {
    if (err) throw err;
    if (source) {
      Question.find({homeworkSource: source.name, tags: req.params.tagname}, (err, questions) => {
        if (err) throw err;
        if (questions) {
          return res.json({success: true, questions: questions});
        } else {
          return res.json({success: false, msg: 'Couldn\'t find questions. This actually a real Inquantir problem. Call 911.'});
        }
      })
    } else {
      return res.json({success: false, msg: 'Couldn\'t find source...'});
    }
  })
}
