const express = require('express')
const router = express.Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')

const SubjectModule = require('./subjectmodule');

// Subject Getters
router.get('/', SubjectModule.getAllSubjects);
router.get('/:subjectname/questions', SubjectModule.getSubjectQuestions);
router.get('/:subjectname/count', SubjectModule.getSubjectQuestionCount);

// Create a subject
router.post('/:subjectname', SubjectModule.createSubject);

// Search subjects
router.post('search/:searchterms', SubjectModule.searchSubject);

module.exports = router;
