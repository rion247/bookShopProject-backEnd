import { model, Schema } from 'mongoose';
import { TProduct } from './product.interface';
import { ProductStatus } from './product.constant';

const productSchema = new Schema<TProduct>(
  {
    title: {
      type: String,
      unique: true,
      required: [true, 'Book Title is required!!!'],
    },
    author: {
      type: String,
      required: [true, 'Author Name is required!!!'],
    },
    category: {
      type: String,
      required: [true, 'Book Category is required!!!'],
    },
    price: {
      type: Number,
      required: [true, 'Book Price is required!!!'],
    },
    quantity: {
      type: Number,
      required: [true, 'Book Quantity is required!!!'],
    },
    image: {
      type: String,
      required: [true, 'Book Image is required!!!'],
    },
    status: {
      type: String,
      enum: {
        values: [...ProductStatus],
        message: '{VALUE} is not supported',
      },
      default: 'available',
    },
  },
  { timestamps: true },
);

export const Product = model<TProduct>('Product', productSchema);
