const rateLimit = require('express-rate-limit');

module.exports.gaiaLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 3, // start blocking after 5 requests
  message:
    "Can't create anymore Gaia tokens"
});
