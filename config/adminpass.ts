import passport from 'passport';
import * as passportJwt from 'passport-jwt';
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;
import { dbConfig } from './database';
import IAdminCB from './interfaces/IAdminCB';

// Chaos-level Auth
module.exports.chaos = (gPassport: any) => {
  const opts: any = {};
  opts['secretOrKey'] = dbConfig.adminSecret;
  opts['jwtFromRequest'] = ExtractJwt.fromAuthHeaderWithScheme('jwt');
  gPassport.use('chaos', new JwtStrategy(opts, (jwtPayload, done: IAdminCB) => {
    if (jwtPayload.permissionLevel === 0) {
      done(null, true);
    } else {
      done(null, false);
    }
  }));
};

// Gaia-level Auth
module.exports.gaia = (gPassport: any) => {
  const opts: any = {};
  opts['secretOrKey'] = dbConfig.adminSecret;
  opts['jwtFromRequest'] = ExtractJwt.fromAuthHeaderWithScheme('jwt');
  gPassport.use('gaia', new JwtStrategy(opts, (jwtPayload, done: IAdminCB) => {
    if (jwtPayload.permissionLevel <= 1) {
      done(null, true);
    } else {
      done(null, false);
    }
  }));
};

// Kronos-level Auth
module.exports.kronos = (gPassport: any) => {
  const opts: any = {};
  opts['secretOrKey'] = dbConfig.adminSecret;
  opts['jwtFromRequest'] = ExtractJwt.fromAuthHeaderWithScheme('jwt');
  gPassport.use('kronos', new JwtStrategy(opts, (jwtPayload, done: IAdminCB) => {
    if (jwtPayload.permissionLevel <= 2) {
      done(null, true);
    } else {
      done(null, false);
    }
  }));
};
