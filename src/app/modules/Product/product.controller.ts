import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ProductService } from './product.service';

const createProduct = catchAsync(async (req, res) => {
  const result = await ProductService.createProductIntoDB(req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Congrats!!! Book created succesfully!!!',
    data: result,
  });
});

const updateProductInformation = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const result = await ProductService.updateProductInformationIntoDB(
    id,
    updateData,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Book updated successfully!!!',
    data: result,
  });
});

const getAllProduct = catchAsync(async (req, res) => {
  const query = req.query;

  const result = await ProductService.getAllProductFromDB(query);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Books retrieved successfully!!!',
    data: result?.result,
    meta: result?.meta,
  });
});

const getSingleProduct = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await ProductService.getSingleProductFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Book retrieved successfully!!!',
    data: result,
  });
});

const deleteSingleProduct = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await ProductService.deleteSingleProductFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Book deleted successfully!!!',
    data: result,
  });
});

export const ProductController = {
  createProduct,
  getAllProduct,
  getSingleProduct,
  deleteSingleProduct,
  updateProductInformation,
};
