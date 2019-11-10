import * as passportJwt from 'passport-jwt';
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;
import { dbConfig } from './database';

import { User } from '../models/usermodel';

import mongoose from 'mongoose';

const passportMain = (passport: any) => {
  const opts: any = {};
  opts['secretOrKey'] = dbConfig.secret;
  opts['jwtFromRequest'] = ExtractJwt.fromAuthHeaderWithScheme('jwt');
  passport.use(new JwtStrategy(opts, (jwtPayload, done) => {
    User.getUserById(jwtPayload._id, (err: string, user: mongoose.Document) => {
      if (err) {
        console.log('Passport error!');
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  }));
};

export default passportMain;
