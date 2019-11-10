import mongoose from 'mongoose';

interface IUser extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  bio: string;
  credentials: object;
  currentSources: string[];
  currentSubjects: string[];
  customization: object;
  email: string;
  fbTokens: string[];
  handle: string;
  knowledge: object;
  name: string;
  password: string;
  phoneNumber: string;
  profileHits: number;
  profileImage: string; // The Image URL
  type: string;
}

export default IUser;
