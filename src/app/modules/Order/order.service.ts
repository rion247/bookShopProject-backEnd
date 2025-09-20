/* eslint-disable @typescript-eslint/no-explicit-any */
import { default as httpStatus } from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../User/user.model';
import { TOrder } from './order.interface';
import { Order } from './order.model';
import { Product } from '../Product/product.model';
import mongoose from 'mongoose';

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
      paymentStatus: 'pending',
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

// const updateProductInformationIntoDB = async (
//   id: string,
//   payload: Partial<TProduct>,
// ) => {
//   const result = await Product.findByIdAndUpdate(
//     id,
//     { ...payload },
//     { new: true, runValidators: true },
//   );

//   return result;
// };

// const getAllProductFromDB = async (query: Record<string, unknown>) => {
//   const productQuery = new QueryBuilder(Product.find(), query)
//     .search(searchAbleField)
//     .filter()
//     .sort()
//     .paginate()
//     .fields();

//   const result = await productQuery.modelQuery;
//   const meta = await productQuery.countTotal();
//   return { result, meta };
// };

// const getSingleProductFromDB = async (id: string) => {
//   const result = await Product.findById(id);
//   return result;
// };

// const deleteSingleProductFromDB = async (id: string) => {
//   const result = await Product.findByIdAndDelete(id);

//   return result;
// };

export const OrderService = {
  createOrderIntoDB,
};
