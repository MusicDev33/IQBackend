import passport from 'passport';
import * as passportJwt from 'passport-jwt';
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;
import { dbConfig } from './database';
import IAdminCB from './interfaces/IAdminCB';

// Chaos-level Auth
const chaosPassport = (gPassport: any) => {
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
const gaiaPassport = (gPassport: any) => {
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
const kronosPassport = (gPassport: any) => {
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

export {chaosPassport, gaiaPassport, kronosPassport };
