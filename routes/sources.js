const express = require('express')
const router = express.Router()
const User = require('../models/usermodel')
const Question = require('../models/questionmodel')
const Answer = require('../models/answermodel')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const AutoRes = require('../RouteUtils/autores')
const config = require('../config/database')
const Source = require('../models/sourcemodel')
const StringUtils = require('../ProtoChanges/string')

router.get('/', (req, res, next) => {
  Source.find({}, (err, sources) => {
    res.json({sources: sources})
  })
})

router.post('/add', (req, res, next) => {
  console.log('Hi')
  const body = req.body;
  const newSource = new Source({
    name: body.name,
    follower: 0,
    posterID: body.posterID,
    views: 0,
    sourceURL: Source.sourceTextToURL(body.name), // Use a function to create this
    tags: [],
    edition: body.edition
  })

  Source.saveSource(newSource, (err, savedSource) => {
    if (savedSource) {
      res.json({success: true, msg: 'Successfully saved source!'});
    } else {
      res.json({success: false, msg: 'Couldn\'t save source.'})
    }
  });
});

router.delete('/:sourceid', (req, res, next) => {
  Source.deleteSource(req.params.sourceid, (err, deletedSource) => {
    if (deletedSource) {
      res.json({success: true, msg: 'Source deleted successfully!'})
    } else {
      res.json({success: false, msg: 'Source couldn\'t be deleted...'})
    }
  });
});

router.post('/:sourceid/tags/:tagname', (req, res, next) => {
  const tagName = StringUtils.urlToName(req.params.tagname);
  Source.addTag(req.params.sourceid, tagName, (err, updatedSource) => {
    if (updatedSource) {
      res.json({success: true, source: updatedSource});
    } else {
      res.json({success: false, msg: 'Could\'t add tag :('});
    }
  })
})

router.delete('/:sourceid/tags/:tagname', (req, res, next) => {
  const tagName = StringUtils.urlToName(req.params.tagname);
  Source.removeTag(req.params.sourceid, tagName, (err, updatedSource) => {
    if (updatedSource) {
      res.json({success: true, source: updatedSource});
    } else {
      res.json({success: false, msg: 'Couldn\'t remove tag.'});
    }
  })
})

router.delete('/:sourceid/tags/', (req, res, next) => {
  Source.deleteTags(req.params.sourceid, (err, updatedSource) => {
    if (updatedSource) {
      res.json({success: true, source: updatedSource});
    } else {
      res.json({success: false, msg: 'Couldn\'t remove tag.'});
    }
  })
})

module.exports = router;
