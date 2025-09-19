import status from 'http-status';
import { TProduct } from './product.interface';
import { Product } from './product.model';
import AppError from '../../errors/AppError';
import QueryBuilder from '../../builder/QueryBuilder';
import { searchAbleField } from './product.constant';

const createProductIntoDB = async (payload: TProduct) => {
  if (
    await Product.findOne({ title: payload?.title, author: payload?.author })
  ) {
    throw new AppError(
      status.BAD_REQUEST,
      'Sorry!!! This product already exist!!!',
    );
  }

  const createProduct = await Product.create(payload);

  if (!createProduct) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      'Failed to create product. Please try again!',
    );
  }

  return createProduct;
};

const updateProductInformationIntoDB = async (
  id: string,
  payload: Partial<TProduct>,
) => {
  const result = await Product.findByIdAndUpdate(
    id,
    { ...payload },
    { new: true, runValidators: true },
  );

  return result;
};

const getAllProductFromDB = async (query: Record<string, unknown>) => {
  const productQuery = new QueryBuilder(Product.find(), query)
    .search(searchAbleField)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await productQuery.modelQuery;
  const meta = await productQuery.countTotal();
  return { result, meta };
};

const getSingleProductFromDB = async (id: string) => {
  const result = await Product.findById(id);
  return result;
};

const deleteSingleProductFromDB = async (id: string) => {
  const result = await Product.findByIdAndDelete(id);

  return result;
};

export const ProductService = {
  createProductIntoDB,
  getAllProductFromDB,
  getSingleProductFromDB,
  updateProductInformationIntoDB,
  deleteSingleProductFromDB,
};
