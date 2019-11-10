import mongoose from 'mongoose';
import { dbConfig } from '../config/database';
import IUser from '../interfaces/IUser';
import IUserCB from './interfaces/IUserCB';

import { Document, Model, model, Schema} from 'mongoose';

type UserType = IUser & Document;

export let UserSchema: Schema = new Schema({
  bio: {
    type: String
  },
  credentials: {
    type: Object
  },
  currentSources: {
    type: Array
  },
  currentSubjects: {
    type: Array
  },
  customization: {
    type: Object
  },
  email: {
    type: String
  },
  fbTokens: {
    type: Array
  },
  handle: {
    type: String
  },
  knowledge: {
    type: Object
  },
  name: {
    type: String
  },
  password: {
    type: String
  },
  phoneNumber: {
    type: String
  },
  profileHits: {
    type: Number
  },
  profileImage: {
    type: String
  },
  type: {
    default: 'user',
    type: String
  }
}, { minimize: false });

export interface IUserModel extends Model<IUser> {
  getUserById(mongoId: string, callback: (error: string, user: mongoose.Document) => void): void;
  changeBio(mongoId: string, bio: string, callback: (error: string, user: mongoose.Document) => void): void;
}

UserSchema.statics.getUserById = (mongoID: string, callback: (error: string, user: mongoose.Document) => void) => {
  User.findById(mongoID, (err, user) => {
    if (err) throw err;
    if (user) {
      return callback(null, user);
    } else {
      return callback(null, null);
    }
  });
};

UserSchema.statics.changeBio = (mongoID: string, bio: string, callback: IUserCB) => {
  User.findById(mongoID, (err, user) => {
    if (err) throw err;
    if (user) {
      user.bio = bio;
      user.markModified('bio');
      user.save((saveError, updatedUser) => {
        if (saveError) throw saveError;
        if (updatedUser) {
          callback(null, updatedUser);
        } else {
          callback(null, null);
        }
      });
    } else {
      callback(null, null);
    }
  });
};

export const User: IUserModel = model<IUser, IUserModel>('User', UserSchema);
