import { model, Schema } from 'mongoose';
import { TOrder } from './order.interface';
import { orderStatusArray, PaymentStatusArray } from './order.constant';

const orderSchema = new Schema<TOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User Information is required!!!'],
      ref: 'User',
    },
    product: {
      type: Schema.Types.ObjectId,
      required: [true, 'Product Information is required!!!'],
      ref: 'Product',
    },
    orderQuantity: {
      type: Number,
      required: [true, 'Order Quantity is required!!!'],
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total Price is required!!!'],
    },
    paymentStatus: {
      type: String,
      enum: {
        values: [...PaymentStatusArray],
        message: '{VALUE} is not supported',
      },
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: {
        values: [...orderStatusArray],
        message: '{VALUE} is not supported',
      },
      default: 'processing',
    },
  },
  { timestamps: true },
);

export const Order = model<TOrder>('Order', orderSchema);
