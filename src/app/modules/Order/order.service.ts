/* eslint-disable @typescript-eslint/no-explicit-any */
import { default as httpStatus } from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../User/user.model';
import { TOrder } from './order.interface';
import { Order } from './order.model';
import { Product } from '../Product/product.model';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { orderStatusObject, searchAbleField } from './order.constant';

const createOrderIntoDB = async (payload: TOrder) => {
  const userId = payload?.user;
  const productId = payload?.product;

  const userData = await User.findById(userId);

  if (!userData) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Sorry! This user is not found!!!',
    );
  }

  if (userData?.status === 'deactive') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Sorry! This user is already deactivated!!!',
    );
  }

  const productData = await Product.findById(productId);

  if (!productData) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found!');
  }

  const productQuantity = productData?.quantity;
  const orderQuantity = payload?.orderQuantity;

  if (orderQuantity > productQuantity) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Not enough stock! Available: ${productQuantity}`,
    );
  }

  const unitProductPrice = productData?.price;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const newProductQuantity = productQuantity - orderQuantity;
    const totalPrice = orderQuantity * unitProductPrice;

    const modifiedData = {
      ...payload,
      orderStatus: 'processing',
      totalPrice,
    };

    const createOrder = await Order.create([modifiedData], { session });

    if (!createOrder.length) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to create order. Please try again!',
      );
    }

    const updateProductInformationIntoDB = await Product.findByIdAndUpdate(
      productId,
      {
        quantity: newProductQuantity,
        status: newProductQuantity === 0 ? 'out-of-stock' : productData?.status,
      },
      { session, new: true, runValidators: true },
    );

    if (!updateProductInformationIntoDB) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to create order. Please try again!',
      );
    }

    await session.commitTransaction();
    await session.endSession();

    return createOrder;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const updateOrderInformationIntoDB = async (
  id: string,
  payload: Partial<TOrder>,
) => {
  const orderData = await Order.findById(id);

  if (!orderData) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found!');
  }

  const orderStatus = orderData?.orderStatus;
  const updateRequestOrderStatus = payload?.orderStatus;

  if (orderStatus === orderStatusObject.cancelled) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Sorry!!! This Order is already ${orderStatus}!`,
    );
  }

  if (
    orderStatus === orderStatusObject.completed &&
    updateRequestOrderStatus === orderStatusObject.processing
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Sorry!!! Order status can not update from ${orderStatus} to ${updateRequestOrderStatus}!`,
    );
  }

  const result = await Order.findByIdAndUpdate(
    id,
    { orderStatus: updateRequestOrderStatus },
    { new: true, runValidators: true },
  );

  return result;
};

const getAllOrderFromDB = async (query: Record<string, unknown>) => {
  const orderQuery = new QueryBuilder(
    Order.find().populate('user product'),
    query,
  )
    .search(searchAbleField)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await orderQuery.modelQuery;
  const meta = await orderQuery.countTotal();
  return { result, meta };
};

const getSingleOrderFromDB = async (id: string) => {
  const result = await Order.findById(id).populate('user product');
  return result;
};

const getMyOrderFromDB = async (email: string) => {
  const userData = await User.findOne({ email });

  const userId = userData?._id;

  if (!userData) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Sorry! This user is not found!!!',
    );
  }

  if (userData?.status === 'deactive') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Sorry! This user is already deactivated!!!',
    );
  }

  const result = await Order.find({ user: userId }).populate('user product');
  return result;
};

export const OrderService = {
  createOrderIntoDB,
  getAllOrderFromDB,
  getSingleOrderFromDB,
  updateOrderInformationIntoDB,
  getMyOrderFromDB,
};
