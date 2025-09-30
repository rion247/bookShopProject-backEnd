import { model, Schema } from 'mongoose';
import { ProductModel, TProduct } from './product.interface';
import { ProductStatus } from './product.constant';

const productSchema = new Schema<TProduct, ProductModel>(
  {
    title: {
      type: String,
      unique: true,
      required: [true, 'Book Title is required!!!'],
    },
    description: {
      type: String,
      required: [true, 'Book Description is required!!!'],
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

productSchema.statics.isProductExist = async function (id: string) {
  const productData = await Product.findById(id);
  return productData;
};

export const Product = model<TProduct, ProductModel>('Product', productSchema);
