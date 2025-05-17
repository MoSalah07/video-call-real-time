import mongoose from "mongoose";
import { Request } from "express";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  password: string;
  createdAt?: Date;
  bio: string;
  profilePic: string;
  nativeLanguage: string;
  learningLanguage: string;
  country: string;
  isOnboarded: boolean;
  friends: mongoose.Types.ObjectId[];
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}

export interface IUserInput {
  fullName: string;
  email: string;
  password: string;
}

export interface IUserLoginInput {
  email: string;
  password: string;
}

export interface IUserOnboardInput {
  fullName: string;
  bio: string;
  nativeLanguage: string;
  learningLanguage: string;
  country: string;
}

// Protected Route
export interface AuthenticatedRequest extends Request {
  user?: IUser;
}
