import { JwtPayload, SignOptions } from 'jsonwebtoken';
import { status } from 'http-status';
import { TChangeUserPassword, TLoginUser } from './auth.interface';
import { User } from '../User/user.model';
import AppError from '../../errors/AppError';
import { TuserInformationForJWT } from '../User/user.interface';
import { tokenGenerator } from './auth.utils';
import config from '../../config';
import bcrypt from 'bcrypt';

const loginUserIntoDB = async (payload: TLoginUser) => {
  const userData = await User.isUserExist(payload?.email);

  if (!userData) {
    throw new AppError(status.NOT_FOUND, 'Sorry! This user is not found!!!');
  }

  if (userData?.status === 'deactive') {
    throw new AppError(
      status.BAD_REQUEST,
      'Sorry! This user is already deactivated!!!',
    );
  }

  if (
    !(await User.isUserPasswordMatched(payload?.password, userData?.password))
  ) {
    throw new AppError(status.BAD_REQUEST, 'Sorry! Wrong Password!!!');
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

const changeUserPasswordInToDB = async (
  user: JwtPayload,
  payload: TChangeUserPassword,
) => {
  const email = user?.userEmail;

  const userData = await User.isUserExist(email);

  if (!userData) {
    throw new AppError(status.NOT_FOUND, 'Sorry! This user is not found!!!');
  }

  if (userData?.status === 'deactive') {
    throw new AppError(
      status.BAD_REQUEST,
      'Sorry! This user is already deactivated!!!',
    );
  }

  if (
    !(await User.isUserPasswordMatched(
      payload?.currentPassword,
      userData?.password,
    ))
  ) {
    throw new AppError(status.BAD_REQUEST, 'Sorry! Wrong Password!!!');
  }

  const newHashedPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  const role = userData?.role;

  await User.findOneAndUpdate(
    { email, role },
    { password: newHashedPassword },
    { new: true, runValidators: true },
  );

  return null;
};

export const AuthService = {
  loginUserIntoDB,
  changeUserPasswordInToDB,
};
