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

export const AuthController = { loginUser };
