const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');
const passport = require('passport')
const StringUtils = require('../../ProtoChanges/string')

const modPath = require('../modelpath')
const modelPath = modPath.MODEL_PATH;
const Question = require(modelPath + 'questionmodel')
const Source = require(modelPath + 'sourcemodel')

router.get('/', (req, res, next) => {
  Source.find({}, (err, sources) => {
    return res.json({sources: sources})
  })
});

router.get('/name/:sourceurl', (req, res, next) => {
  const sourceName = StringUtils.urlToName(req.params.sourceurl);
  Source.findOne({name: sourceName}, (err, source) => {
    if (err) throw err;
    if (source) {
      return res.json({success: true, source: source});
    } else {
      return res.json({success: false, msg: 'Couldn\'t find source!'});
    }
  })
})

router.get('/search/:searchterms', (req, res, next) => {
  Source.searchByName(req.params.searchterms.substring(0, 39), (err, sources) => {
    if (sources.length) {
      return res.json({success: true, sources: sources});
    } else {
      return res.json({success: false,
                msg: 'Couldn\'t find any sources based on your search terms...',
                sources: []})
    }
  })
});

router.get('/:sourceid/questions', (req, res, next) => {
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
});

router.get('/url/:sourceurl/questions', (req, res, next) => {
  const sourceName = StringUtils.urlToName(req.params.sourceurl);
  Question.findBySourceName(sourceName, (err, questions) => {
    if (questions){
      return res.json({success: true, questions: questions})
    } else {
      return res.json({success: false, msg: 'Couldn\'t find questions from source.'});
    }
  })
})

router.get('/:sourceid/tags', (req, res, next) => {
  const id = mongoose.Types.ObjectId(req.params.sourceid);
  Source.findById(id, (err, source) => {
    if (err) throw err;
    if (source) {
      return res.json({success: true, tags: source.tags});
    } else {
      return res.json({success: false, msg: 'Couldn\'t find source...'});
    }
  })
});

router.get('/:sourceid/:tagname/questions', (req, res, next) => {
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
      res.json({success: false, msg: 'Couldn\'t find source...'});
    }
  })
})

router.post('/add', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  const body = req.body;

  if (!body.name.match(/^[a-zA-Z0-9\-' ]+$/g)) {
    return res.json({success: false, msg: 'Source names are alphanumeric (and may contain dashes and apostrophes)'})
  }

  // Should I set a posterID for these or no?
  const newSource = new Source({
    name: body.name,
    followers: 0,
    posterID: 'no id',
    views: 0,
    sourceURL: Source.sourceTextToURL(body.name), // Use a function to create this
    tags: body.tags ? body.tags : [],
    edition: body.edition ? body.edition : '',
    author: body.author ? body.author : ''
  })

  Source.saveSource(newSource, (err, savedSource) => {
    if (savedSource) {
      return res.json({success: true, msg: 'Successfully saved source!', source: savedSource});
    } else {
      return res.json({success: false, msg: 'Couldn\'t save source.'})
    }
  });
});

router.delete('/:sourceid', passport.authenticate('gaia', {session:false}), (req, res, next) => {
  Source.deleteSource(req.params.sourceid, (err, deletedSource) => {
    if (deletedSource) {
      return res.json({success: true, msg: 'Source deleted successfully!'})
    } else {
      return res.json({success: false, msg: 'Source couldn\'t be deleted...'})
    }
  });
});

router.post('/:sourceid/tags/:tagname', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  if (!req.params.tagname.match(/^[a-zA-Z0-9_\-]+$/g)) {
    return res.json({success: false, msg: "Tags must be alphanumeric, but can also have dashes"})
  }

  const tagName = StringUtils.urlToName(req.params.tagname);
  Source.addTag(req.params.sourceid, tagName, (err, updatedSource) => {
    if (updatedSource) {
      return res.json({success: true, source: updatedSource});
    } else {
      return res.json({success: false, msg: 'Could\'t add tag :('});
    }
  })
})

router.delete('/:sourceid/tags/:tagname', passport.authenticate('gaia', {session:false}), (req, res, next) => {
  const tagName = StringUtils.urlToName(req.params.tagname);
  Source.removeTag(req.params.sourceid, tagName, (err, updatedSource) => {
    if (updatedSource) {
      return res.json({success: true, source: updatedSource});
    } else {
      return res.json({success: false, msg: 'Couldn\'t remove tag.'});
    }
  })
})

router.delete('/:sourceid/tags/', passport.authenticate('gaia', {session:false}), (req, res, next) => {
  Source.deleteTags(req.params.sourceid, (err, updatedSource) => {
    if (updatedSource) {
      return res.json({success: true, source: updatedSource});
    } else {
      return res.json({success: false, msg: 'Couldn\'t remove tag.'});
    }
  })
})

module.exports = router;
