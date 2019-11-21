const express = require('express')
const router = express.Router()
const passport = require('passport')

const UserModule = require('./usermodule')

// Register
router.post('/register', UserModule.registerLimit, UserModule.registerUser);
router.post('/g/register', UserModule.registerLimit, UserModule.googleRegisterUser);

// Authentication
router.post('/authenticate', UserModule.authLimit, UserModule.authorizeUser);
router.post('/g/authenticate', UserModule.authLimit, UserModule.googleAuthUser);

// User Getters
router.get('/profile/:handle', UserModule.getUserByHandleRoute);
router.get('/check/handle/:handle', UserModule.getIfHandleTaken);
router.get('/:userid/questions', UserModule.getUserQuestionsRoute);
router.get('/:userid/answers', UserModule.getUserAnswersRoute);
router.get('/profile', passport.authenticate('jwt', {session:false}), UserModule.getUserProfileRoute);

// User Setters
router.post('/:userid/bio', passport.authenticate('jwt', {session:false}), UserModule.setUserBioRoute);
router.put('/:userid/googleid/add', UserModule.setUserGoogleID);

// User Subject Routes
router.post('/:userid/subjects/:subjectname', passport.authenticate('jwt', {session:false}), UserModule.addSubjectRoute); // User follows subject
router.delete('/:userid/subjects/:subjectname', passport.authenticate('jwt', {session:false}), UserModule.removeSubjectRoute); // User unfollows subject

// User Source Routes
router.post('/:userid/sources/:sourcename', passport.authenticate('jwt', {session:false}), UserModule.addSource); // User follows source
router.delete('/:userid/sources/:sourcename', passport.authenticate('jwt', {session:false}), UserModule.removeSource);

// User Knowledge Routes
router.post('/:userid/knowledge/:subject', passport.authenticate('jwt', {session:false}), UserModule.addKnowledgeRoute);
router.delete('/:userid/knowledge/:subject', passport.authenticate('jwt', {session:false}), UserModule.removeKnowledgeRoute);
router.put('/:userid/knowledge', passport.authenticate('jwt', {session:false}), UserModule.updateKnowledgeRoute);

// This route isn't really used anymore...
router.post('/location/add', UserModule.addLocation);

module.exports = router;
