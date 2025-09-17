import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { TuserInformationForJWT } from '../User/user.interface';

export const tokenGenerator = (
  user: TuserInformationForJWT,
  secret: string,
  expiresIn: SignOptions['expiresIn'],
) => {
  return jwt.sign(user, secret, { expiresIn });
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};
