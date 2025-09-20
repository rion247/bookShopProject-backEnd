import { Types } from 'mongoose';

export interface TOrder {
  user: Types.ObjectId;
  product: Types.ObjectId;
  orderQuantity: number;
  totalPrice: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'processing' | 'completed' | 'cancelled';
}
