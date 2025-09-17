/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export interface TUser {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}

export type TuserInformationForJWT = {
  userEmail: string;
  role: string;
};

export interface UserModel extends Model<TUser> {
  isUserExist(email: string): Promise<TUser | null>;
  isUserPasswordMatched(plainText: string, hashText: string): Promise<boolean>;
}
