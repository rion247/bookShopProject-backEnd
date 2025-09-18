import { USER_ROLE } from './auth.constant';

export type TUser_Role = keyof typeof USER_ROLE;

export type TLoginUser = {
  email: string;
  password: string;
};

export type TChangeUserPassword = {
  currentPassword: string;
  newPassword: string;
};
