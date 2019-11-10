import mongoose from 'mongoose';
import { dbConfig } from '../config/database';
import IUser from '../interfaces/IUser';

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

// const User = mongoose.model<UserType>('User', new UserSchema());

export interface IUserModel extends Model<IUser> {
  getUserById(mongoId: string, callback: (error: string, user: mongoose.Document) => void): void;
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

export const User: IUserModel = model<IUser, IUserModel>('User', UserSchema);
