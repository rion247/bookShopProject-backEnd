import { Types } from 'mongoose';

export interface TOrder {
  user: Types.ObjectId;
  product: Types.ObjectId;
  orderQuantity: number;
  totalPrice: number;
  transactionInfo?: {
    id: string;
    transactionStatus: string;
    bank_status: string;
    sp_code: string;
    sp_message: string;
    method: string;
    date_time: string;
  };
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'processing' | 'completed' | 'cancelled';
}
