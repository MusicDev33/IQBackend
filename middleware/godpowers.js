const jwt = require('jsonwebtoken');

/*
God Status is basically just admin powers. There'll be
several levels of God status as opposed to levels of admin status.
Initially, the heirarchy will be fairly flat, as there's not really much to
worry about.

Complete System Control: Chaos
Complete System Control.2: Gaia

Complete Resource Access w/o Scaled Functions: Kronos

User-Level API Interactions: User

Guest-Level APi Interactions: Guest

*/

module.exports.validateGodHeaders = function(req, res, next) {
  if (req.header('IQ-God-Header') === '$toplevel@') {
    next()
  } else {
    res.sendStatus(404);
  }
}

// Only validates Gaia+ status
module.exports.validateGodStatus = function(req, res, next) {

}
