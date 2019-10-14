const config = require('../../config/database');
const jwt = require('jsonwebtoken');

module.exports.generateGaiaToken = function(req, res, next) {
  const password = '*utF$39@@';

  if (req.body.pass === password) {
    const adminObject = {permissionLevel: 1}
    // Lol JSON Web Token Token
    const jwtToken = jwt.sign(adminObject, config.adminSecret, {
      expiresIn: 3600 // 1 hour
    });
    return res.json({token: 'JWT ' + jwtToken});
  }
}

module.exports.generateKronosToken = function(req, res, next) {
  const password = '*utF$39^&';

  if (req.body.pass === password) {
    const adminObject = {permissionLevel: 2}
    // Lol JSON Web Token Token
    const jwtToken = jwt.sign(adminObject, config.adminSecret, {
      expiresIn: 7200 // 2 hours
    });
    return res.json({token: 'JWT ' + jwtToken});
  }
}

module.exports.testGaiaRoute = function(req, res, next) {
  res.json({success: true});
}

module.exports.testKronosRoute = function(req, res, next) {
  res.json({success: true});
}
