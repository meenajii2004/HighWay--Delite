import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  dateOfBirth?: Date;
  provider: 'email' | 'google';
  googleId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  dateOfBirth: {
    type: Date,
    required: false,
  },
  provider: {
    type: String,
    enum: ['email', 'google'],
    required: true,
  },
  googleId: {
    type: String,
    sparse: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export const User = mongoose.model<IUser>('User', userSchema);
