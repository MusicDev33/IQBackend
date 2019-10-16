const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/usermodel');
const config = require('../config/database');

// Chaos-level Auth
module.exports.chaos = function(passport){
  let opts = {};
  opts.secretOrKey = config.adminSecret;
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  passport.use('chaos', new JwtStrategy(opts, (jwt_payload, done) => {
    if (jwt_payload.permissionLevel === 0) {
      done(null, true);
    } else {
      done(null, false);
    }
  }));
}

// Gaia-level Auth
module.exports.gaia = function(passport){
  let opts = {};
  opts.secretOrKey = config.adminSecret;
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  passport.use('gaia', new JwtStrategy(opts, (jwt_payload, done) => {
    if (jwt_payload.permissionLevel <= 1) {
      done(null, true);
    } else {
      done(null, false);
    }
  }));
}

// Kronos-level Auth
module.exports.kronos = function(passport){
  let opts = {};
  opts.secretOrKey = config.adminSecret;
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  passport.use('kronos', new JwtStrategy(opts, (jwt_payload, done) => {
    if (jwt_payload.permissionLevel <= 2) {
      done(null, true);
    } else {
      done(null, false);
    }
  }));
}
