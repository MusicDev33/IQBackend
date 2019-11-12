import IFailRes from '../../interfaces/IFailRes';
import IUser from '../../interfaces/IUser';
import { IUserModel } from '../../models/usermodel';

import modelPaths from '../modelpath';
const modelPath = modelPaths.MODEL_PATH_ONE;

const User = '../../models/usermodel';

import jsonwebtoken from 'jsonwebtoken';
import {dbConfig} from '../../config/database';

import RateLimit from 'express-rate-limit';

import { Request, Response } from 'express';

function validate(body: any): IFailRes {
  if (body.handle.indexOf(' ') >= 0 || !body.handle.match(/^[a-z0-9_]+$/g)) {
    return {success: false, msg: 'You can\'t have special characters in your handle. Letters must be lowercase.'};
  }

  if (!body.firstName.match(/^[a-zA-Z0-9_\-']+$/g) || !body.lastName.match(/^[a-zA-Z0-9_\-']+$/g)) {
    return {success: false, msg: 'You can\'t have special characters in your name.'};
  }

  if (body.phoneNumber && !body.phoneNumber.match(/^[0-9\-]+$/g)) {
    return {success: false, msg: 'You can only have numbers in your phone number.'};
  }

  if (body.password.length < 8) {
    return {success: false, msg: 'Your password must have 8 characters in it!'};
  }
}

const registerLimit = RateLimit({
  max: 100, // start blocking after 100 requests
  message:
    'Too many accounts created from this IP, please try again after an hour',
  windowMs: 60 * 60 * 1000 // 1 hour window
});

const loginLimit = RateLimit({
  max: 10, // start blocking after 10 requests
  message:
    'Too many login attempts have been made',
  windowMs: 15 * 60 * 1000 // 15 minutes
});

const registerUser = (req: Request, res: Response, next: any) => {
  // Ugh, nested ifs AND callbacks. Can you think of anything worse?
  // P.S. Maybe I just suck at writing decent code...

  if (validate(req.body).success === false) {
    return res.json(validate(req.body));
  }

  User.getUserByHandle(req.body.handle, (err: string, user: IUser) => {
    if (user) {
      return res.json({success: false, msg: 'There\'s already a user by that name!'});
    } else {
      User.getUserByEmail(req.body.email, (errOnEmail: string, userByEmail: IUser) => {
        if (userByEmail) {
          return res.json({success: false, msg: 'This email is already associated with an account.'});
        } else {
          const newUser = new IUserModel({
            bio: '',
            currentSources: [],
            currentSubjects: [],
            customization: {},
            email: req.body.email.toLowerCase(),
            fbTokens: [],
            handle: req.body.handle,
            knowledge: {},
            name: req.body.firstName + ' ' + req.body.lastName,
            password: req.body.password,
            phoneNumber: req.body.phoneNumber,
            profileHits: 0,
            profileImage: ''
          });

          User.addUser(newUser, (errOnSave: string, savedUser: IUser) => {
            if (savedUser) {
              return res.json({success: true, msg: 'User registered!'});
            } else {
              return res.json({success: false, msg: 'Something went wrong!'});
            }
          });
        }
      });
    }
  });
};
