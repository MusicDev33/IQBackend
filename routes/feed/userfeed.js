const express = require('express')
const router = express.Router()
const FeedAlgo = require('../../feed/feedv1')

module.exports.getUserFeed = function(req, res, next) {
  FeedAlgo.getFeed(req.params.userid, (err, feed) => {
    if (feed) {
      return res.json({success: true, feed: feed})
    } else {
      return res.json({success: false, msg: 'Could not return feed'})
    }
  })
}
