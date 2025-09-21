import status from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { OrderService } from './order.service';

const createOrder = catchAsync(async (req, res) => {
  const result = await OrderService.createOrderIntoDB(req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Congrats!!! Order successfully!!!',
    data: result,
  });
});

const updateOrderStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const orderStatusUpdateData = req.body;

  const result = await OrderService.updateOrderInformationIntoDB(
    id,
    orderStatusUpdateData,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Order status updated successfully!!!',
    data: result,
  });
});

const getAllOrder = catchAsync(async (req, res) => {
  const query = req.query;

  const result = await OrderService.getAllOrderFromDB(query);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Orders retrieved successfully!!!',
    data: result?.result,
    meta: result?.meta,
  });
});

const getSingleOrder = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await OrderService.getSingleOrderFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Order retrieved successfully!!!',
    data: result,
  });
});

const getMyOrder = catchAsync(async (req, res) => {
  const { userEmail } = req.user;

  const result = await OrderService.getMyOrderFromDB(userEmail);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Order retrieved successfully!!!',
    data: result,
  });
});

export const OrderController = {
  createOrder,
  getAllOrder,
  getSingleOrder,
  updateOrderStatus,
  getMyOrder,
};
