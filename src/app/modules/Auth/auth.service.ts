import { SignOptions } from 'jsonwebtoken';
import { status } from 'http-status';
import { TLoginUser } from './auth.interface';
import { User } from '../User/user.model';
import AppError from '../../errors/AppError';
import { TuserInformationForJWT } from '../User/user.interface';
import { tokenGenerator } from './auth.utils';
import config from '../../config';

const loginUserIntoDB = async (payload: TLoginUser) => {
  const userData = await User.isUserExist(payload?.email);

  if (!userData) {
    throw new AppError(status.NOT_FOUND, 'Sorry! This user is not found!!!');
  }

  const userInformationForJWT: TuserInformationForJWT = {
    userEmail: userData?.email,
    role: userData?.role,
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

  return { accessToken, refreshToken };
};

export const AuthService = {
  loginUserIntoDB,
};
