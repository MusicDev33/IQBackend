const express = require('express')
const router = express.Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')

const UserModule = require('./usermodule')

// Register
router.post('/register', UserModule.registerLimit, UserModule.registerUser);

// Authentication
router.post('/authenticate', UserModule.authLimit, UserModule.authorizeUser);

// User Getters
router.get('/profile/:handle', UserModule.getUserByHandleRoute);
router.get('/:userid/questions', UserModule.getUserQuestionsRoute);
router.get('/:userid/answers', UserModule.getUserAnswersRoute);
router.get('/profile', passport.authenticate('jwt', {session:false}), UserModule.getUserProfileRoute);

// User Setters
router.post('/:userid/bio', UserModule.setUserBioRoute);

// User Subject Routes
router.post('/:userid/subjects/:subjectname', UserModule.addSubjectRoute); // User follows subject
router.delete('/:userid/subjects/:subjectname', UserModule.removeSubjectRoute); // User unfollows subject

// User Source Routes
router.post('/:userid/sources/:sourcename', UserModule.addSource); // User follows source
router.delete('/:userid/sources/:sourcename', UserModule.removeSource);

// User Knowledge Routes
router.post('/:userid/knowledge/:subject', UserModule.addKnowledgeRoute);
router.delete('/:userid/knowledge/:subject', UserModule.removeKnowledgeRoute);
router.put('/:userid/knowledge', UserModule.updateKnowledgeRoute);

// This route isn't really used anymore...
router.post('/location/add', UserModule.addLocation);

module.exports = router;
