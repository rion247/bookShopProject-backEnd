import { SignOptions } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../errors/AppError';
import { tokenGenerator } from '../Auth/auth.utils';
import { TUser, TuserInformationForJWT } from './user.interface';
import { User } from './user.model';
import { status } from 'http-status';

const createUserIntoDB = async (password: string, userData: TUser) => {
  if (await User.isUserExist(userData?.email)) {
    throw new AppError(
      status.BAD_REQUEST,
      'Sorry!!! This user already exist!!!',
    );
  }

  const modifiedUserData = {
    ...userData,
    password: password || (config.default_password as string),
  };

  const createUser = await User.create(modifiedUserData);

  if (!createUser) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      'Failed to create user. Please try again!',
    );
  }

  const userInformationForJWT: TuserInformationForJWT = {
    userEmail: createUser?.email,
    role: createUser?.role,
  };

  const accessToken = tokenGenerator(
    userInformationForJWT,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as SignOptions['expiresIn'],
  );

  const refreshToken = tokenGenerator(
    userInformationForJWT,
    config.jwt_refresh_secret as string,
    config.jwt_refresh__expires_in as SignOptions['expiresIn'],
  );

  return { createUser, accessToken, refreshToken };
};

const changeUserStatusIntoDB = async (email: string, status: TUser) => {
  const result = await User.findOneAndUpdate(
    { email },
    { status },
    { new: true },
  );

  return result;
};

export const UserService = {
  createUserIntoDB,
  changeUserStatusIntoDB,
};
