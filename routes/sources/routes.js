const express = require('express')
const router = express.Router()
const passport = require('passport')

const SourceModule = require('./sourcemodule')

// Getters
router.get('/', SourceModule.getAllSources);
router.get('/name/:sourceurl', SourceModule.getSourceByName)
router.get('/:sourceid/questions', SourceModule.getQuestionsFromSourceId)
router.get('/url/:sourceurl/questions', SourceModule.getQuestionsFromSourceUrl)
router.get('/:sourceid/tags', SourceModule.getSourceTags)
router.get('/:sourceid/:tagname/questions', SourceModule.getQuestionsFromSourceTag)

// Search
router.get('/search/:searchterms', SourceModule.searchSources)

// Create
router.post('/add', passport.authenticate('jwt', {session: false}), SourceModule.createSource)
router.post('/:sourceid/tags/:tagname', passport.authenticate('jwt', {session: false}), SourceModule.addTagsToSource)

// Removal
router.delete('/:sourceid', passport.authenticate('gaia', {session: false}), SourceModule.deleteSource)
router.delete('/:sourceid/tags/:tagname', passport.authenticate('gaia', {session: false}), SourceModule.deleteTagFromSource)
router.delete('/:sourceid/tags/', passport.authenticate('gaia', {session: false}), SourceModule.deleteAllTagsFromSource)

module.exports = router;
