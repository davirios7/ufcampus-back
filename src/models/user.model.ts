import mongoose, { Schema, Document } from 'mongoose';
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  registration: number;
}

const UserSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  registration: {
    type: Number,
    required: true,
    unique: true,
  },
});

export default mongoose.model<IUser>('User', UserSchema);
