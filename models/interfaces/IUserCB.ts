import mongoose from 'mongoose';

interface IUserCB { // Admin Callback
  (error: string, user: mongoose.Document): void;
}

export default IUserCB;
