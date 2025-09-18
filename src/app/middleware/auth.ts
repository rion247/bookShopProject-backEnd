import { NextFunction, Request, Response } from 'express';
import { TUser_Role } from '../modules/Auth/auth.interface';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import status from 'http-status';
import config from '../config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../modules/User/user.model';

const auth = (...requiredRoles: TUser_Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(
        status.UNAUTHORIZED,
        'Sorry!!! You are not authorized!!!',
      );
    }

    let decoded;

    try {
      decoded = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as JwtPayload;
    } catch {
      throw new AppError(
        status.UNAUTHORIZED,
        'Sorry!!! You are not authorized!!!',
      );
    }

    const { userEmail, role } = decoded;

    const userData = await User.isUserExist(userEmail);

    if (!userData) {
      throw new AppError(status.NOT_FOUND, 'Sorry! This user is not found!!!');
    }

    if (userData?.status === 'deactive') {
      throw new AppError(
        status.BAD_REQUEST,
        'Sorry! This user is already deactivated!!!',
      );
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(
        status.UNAUTHORIZED,
        'Sorry!!! You are not authorized!!!',
      );
    }

    req.user = decoded as JwtPayload;

    next();
  });
};

export default auth;
