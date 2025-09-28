/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export interface TProduct {
  title: string;
  description: string;
  author: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
  status: 'available' | 'out-of-stock';
}

export interface ProductModel extends Model<TProduct> {
  isProductExist(id: string): Promise<TProduct | null>;
}
