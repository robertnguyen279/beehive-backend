// @ts-nocheck

import mongoose, { Document, model, Schema, Model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import jwt_decode from 'jwt-decode';
export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  genders?: 'Male' | 'Female';
  type: 'GoogleAuth' | 'FacebookAuth' | 'BeehiveAuth';
  birthday?: string;
  cart?: Array<string>;
  token: Array<string>;
  purchaseHistory?: Array<string>;
}

interface UserDocument extends User, Document {
  fullName: string;
  generateSessionToken(): Promise<string>;
}

interface UserModel extends Model<UserDocument> {
  generateHashPassword(password: string): Promise<string>;
  findByToken(token: string): Promise<Model<UserDocument>>;
}

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate: (value: string) => {
        if (!validator.isEmail(value)) throw new Error('Email is invalid.');
      },
    },
    password: {
      type: String,
      required: true,
      validate: (value: string) => {
        if (/\s/.test(value))
          throw new Error('Password cannot contain whitespace.');
        if (!/[a-zA-Z]/.test(value) || !/\d/.test(value))
          throw new Error('Password must contain both number and character.');
      },
    },
    genders: {
      type: String,
      enum: ['Male', 'Female'],
    },
    roles: {
      type: Number,
      enum: [0, 1, 2],
      default: 0,
    },
    accountType: {
      type: String,
      enum: ['GoogleAuth', 'FacebookAuth', 'BeehiveAuth'],
      default: 'BeehiveAuth',
    },
    birthday: {
      type: String,
    },
    cart: {
      type: Array,
    },
    purchaseHistory: {
      type: Array,
    },
    friends: {
      type: Array,
    },
    requestsReceived: {
      type: Array,
    },
    requestsSent: {
      type: Array,
    },
    token: {
      type: Array,
    },
    groups: {
      type: Array,
    },
  },
  {
    timestamps: true,
  },
);

UserSchema.statics.generateHashPassword = async (password: string) =>
  bcrypt.hash(password, 8);

UserSchema.statics.findByToken = async (token: string) => {
  const { email, type, userId } = jwt_decode(token);

  if (type && type === 'BeehiveAuth') {
    return await User.findOne({ _id: userId, token: { $in: token } }).select(
      '-password -token',
    );
  }
};

UserSchema.methods.generateSessionToken = async function (this: UserDocument) {
  const token = await jwt.sign(
    { userId: this._id, email: this.email, type: 'BeehiveAuth' },
    process.env.JWT_SECRET,
  );

  return (this.token = this.token.concat(token));
};

const User =
  (mongoose.models.User as UserModel) ||
  model<UserDocument, UserModel>('User', UserSchema);

export default User;
