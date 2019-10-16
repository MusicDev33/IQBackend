const express = require('express')
const router = express.Router()
const passport = require('passport')

const FeedModule = require('./feedmodule')

router.get('/:userid', passport.authenticate('jwt', {session:false}), FeedModule.getUserFeed);

module.exports = router;
