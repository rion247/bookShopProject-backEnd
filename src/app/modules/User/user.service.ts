import { SignOptions } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../errors/AppError';
import { tokenGenerator } from '../Auth/auth.utils';
import { TUser, TuserInformationForJWT } from './user.interface';
import { User } from './user.model';
import { default as httpStatus } from 'http-status';

const createUserIntoDB = async (password: string, userData: TUser) => {
  if (await User.isUserExist(userData?.email)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Sorry!!! This user already exist!!!',
    );
  }

  const modifiedUserData = {
    ...userData,
    password: password || (config.default_password as string),
    role: 'user',
  };

  const createUser = await User.create(modifiedUserData);

  if (!createUser) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
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
  const userData = await User.isUserExist(email);

  if (!userData) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Sorry! This user is not found!!!',
    );
  }

  if (userData?.role === 'admin') {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Sorry!!! You are not authorized!!!',
    );
  }

  const result = await User.findOneAndUpdate(
    { email },
    { status },
    { new: true },
  );

  return result;
};

const changeUserRoleIntoDB = async (email: string, role: string) => {
  const userData = await User.isUserExist(email);

  if (!userData) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Sorry! This user is not found!!!',
    );
  }

  if (userData?.role === 'admin') {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Sorry!!! You are not authorized!!!',
    );
  }

  const result = await User.findOneAndUpdate(
    { email },
    { role },
    { new: true },
  );

  return result;
};

const getAllUserFromDB = async () => {
  const result = await User.find({ role: 'user' });
  return result;
};

const getSingleUserFromDB = async (email: string) => {
  const result = await User.findOne({ email });
  return result;
};

const getMeFromDB = async (email: string) => {
  const result = await User.findOne({ email });

  return result;
};

const updateUserProfileIntoDB = async (
  userEmail: string,
  payload: Partial<TUser>,
) => {
  const userData = await User.isUserExist(userEmail);

  if (!userData) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Sorry! This user is not found!!!',
    );
  }

  if (userData?.status === 'deactive') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Sorry! This user is already deactivated!!!',
    );
  }

  const email = userData?.email;
  const name = payload?.name;

  const result = await User.findOneAndUpdate(
    { email },
    { name },
    { new: true, runValidators: true },
  );

  return result;
};

export const UserService = {
  createUserIntoDB,
  changeUserStatusIntoDB,
  getAllUserFromDB,
  getSingleUserFromDB,
  getMeFromDB,
  updateUserProfileIntoDB,
  changeUserRoleIntoDB,
};
