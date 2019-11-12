import express from 'express';
const router = express.Router();
import passport from 'passport';

import { Request, Response } from 'express';

import User from '../../models/usermodel';

// User Setters
router.post('/:userid/bio', passport.authenticate('jwt', {session: false}), (req: Request, res: Response, next) => {
  const reqUser: any = req.user;
  if ('' + reqUser._id !== '' + req.params.userid) {
    return res.status(401).json({success: false, msg: 'Not authorized!'});
  }
  User.changeBio(req.params.userid, req.body.bio, (err, updatedUser) => {
    if (updatedUser) {
      return res.json({success: true, msg: 'Changed bio!'});
    } else {
      return res.json({success: false, msg: 'Couldn\'t change bio...'});
    }
  });
});

const userRoutes = router;

export default userRoutes;
