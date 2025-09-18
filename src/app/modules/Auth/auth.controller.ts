import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { AuthService } from './auth.service';
import config from '../../config';
import sendResponse from '../../utils/sendResponse';

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthService.loginUserIntoDB(req?.body);

  const { accessToken, refreshToken } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.node_env === 'production',
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User Login Successful!!!',
    data: { accessToken },
  });
});

const changePassword = catchAsync(async (req, res) => {
  const userInformation = req?.user;
  const passwordData = req?.body;

  const result = await AuthService.changeUserPasswordInToDB(
    userInformation,
    passwordData,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Password changed succesfully!!!',
    data: result,
  });
});

export const AuthController = { loginUser, changePassword };
