const express = require('express')
const router = express.Router()
const passport = require('passport')

const SubjectModule = require('./subjectmodule');

// Subject Getters
router.get('/', SubjectModule.getAllSubjects);
router.get('/:subjectname/questions', SubjectModule.getSubjectQuestions);
router.get('/:subjectname/count', SubjectModule.getSubjectQuestionCount);

// Create a subject
router.post('/:subjectname', passport.authenticate('jwt', {session: false}), SubjectModule.createSubject);

// Search subjects
router.get('/search/:searchterms', SubjectModule.searchSubject);

module.exports = router;
