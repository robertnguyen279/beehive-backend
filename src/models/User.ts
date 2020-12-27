import { Document, model, Schema } from 'mongoose';
import validator from 'validator';

export interface User extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  genders?: string;
  birthday?: string;
  cart?: Array<string>;
  purchaseHistory?: Array<string>;
}

const UserSchema = new Schema({
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
    minLength: 8,
    maxLength: 16,
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
  birthday: {
    type: String,
  },
  cart: {
    type: Array,
  },
  purchaseHistory: {
    type: Array,
  },
  friend: {
    type: Array,
  },
});

export default model<User>('User', UserSchema);
