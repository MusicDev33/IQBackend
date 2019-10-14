const express = require('express')
const router = express.Router()
const passport = require('passport')
const FeedModule = require('../../feed/feedv1')

router.get('/:userid', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  FeedModule.getFeed(req.params.userid, (err, feed) => {
    if (feed) {
      res.json({success: true, feed: feed})
    } else {
      res.json({success: false, msg: 'Could not return feed'})
    }
  })
})

module.exports = router;
