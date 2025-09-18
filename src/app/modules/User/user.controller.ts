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

const changeUserStatus = catchAsync(async (req, res) => {
  const { status: userStatus } = req.body;
  const { email } = req.params;

  const result = await UserService.changeUserStatusIntoDB(email, userStatus);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User Status is changed successfully!!!',
    data: result,
  });
});

const getAllUser = catchAsync(async (req, res) => {
  const result = await UserService.getAllUserFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Users are retrieved successfully!!!',
    data: result,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const { email } = req.params;

  const result = await UserService.getSingleUserFromDB(email);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User is retrieved successfully!!!',
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const { userEmail } = req.user;

  const result = await UserService.getMeFromDB(userEmail);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User is retrieved successfully!!!',
    data: result,
  });
});

export const UserController = {
  createUser,
  changeUserStatus,
  getAllUser,
  getSingleUser,
  getMe,
};
