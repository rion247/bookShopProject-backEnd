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
import { OrderUtils } from './order.utils';

const createOrderIntoDB = async (
  email: string,
  payload: TOrder,
  client_ip: string,
) => {
  const userData = await User.findOne({ email });
  const productId = payload?.product;

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

  const user = userData?._id;

  const productData = await Product.findById(productId);

  if (!productData) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found!');
  }

  if (productData?.status === 'out-of-stock') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Not enough stock!');
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
      user,
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

    //shujopay
    const shurjoPayPayload = {
      amount: totalPrice,
      order_id: createOrder[0]?._id,
      currency: 'BDT',
      customer_name: userData?.name,
      customer_address: 'N/A',
      customer_email: userData?.email,
      customer_phone: 'N/A',
      customer_city: 'N/A',
      client_ip,
    };

    const payment = await OrderUtils.makePaymentAsync(shurjoPayPayload);

    if (payment?.transactionStatus) {
      await Order.findByIdAndUpdate(
        createOrder[0]?._id,
        {
          transactionInfo: {
            id: payment.sp_order_id,
            transactionStatus: payment.transactionStatus,
          },
        },
        { session, new: true, runValidators: true },
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

    return payment.checkout_url;
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

const verifyPayment = async (order_id: string) => {
  const verifiedPaymentData = await OrderUtils.verifyPaymentAsync(order_id);

  if (verifiedPaymentData.length) {
    const result = await Order.findOneAndUpdate(
      {
        'transactionInfo.id': order_id,
      },
      {
        'transactionInfo.bank_status': verifiedPaymentData[0]?.bank_status,
        'transactionInfo.sp_code': verifiedPaymentData[0]?.sp_code,
        'transactionInfo.sp_message': verifiedPaymentData[0]?.sp_message,
        'transactionInfo.method': verifiedPaymentData[0]?.method,
        'transactionInfo.date_time': verifiedPaymentData[0]?.date_time,
        paymentStatus:
          verifiedPaymentData[0].bank_status == 'Success'
            ? 'paid'
            : verifiedPaymentData[0].bank_status == 'Failed'
              ? 'pending'
              : verifiedPaymentData[0].bank_status == 'Cancel'
                ? 'failed'
                : 'pending',
      },
      { new: true, runValidators: true },
    );

    return result;
  }

  return verifiedPaymentData;
};

export const OrderService = {
  createOrderIntoDB,
  getAllOrderFromDB,
  getSingleOrderFromDB,
  updateOrderInformationIntoDB,
  getMyOrderFromDB,
  verifyPayment,
};
