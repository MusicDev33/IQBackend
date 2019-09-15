const express = require('express')
const router = express.Router()
const FeedModule = require('../../feed/feedv1')

router.get('/:userid', (req, res, next) => {
  FeedModule.getFeed(req.params.userid, (err, feed) => {
    if (feed) {
      res.json({success: true, feed: feed})
    } else {
      res.json({success: false, msg: 'Could not return feed'})
    }
  })
})

module.exports = router;
