import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';
import config from '../../config';

const createUser = catchAsync(async (req, res) => {
  const { password, user: userData } = req.body;

  const result = await UserService.createUserIntoDB(password, userData);

  res.cookie('refreshToken', result.refreshToken, {
    secure: config.node_env === 'production',
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Congrats!!! User created succesfully!!!',
    data: { newUser: result?.createUser, accessToken: result?.accessToken },
  });
});

export const UserController = { createUser };
