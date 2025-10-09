import { Router } from 'express';
import { productValidationSchemas } from './product.validation';
import validateRequest from '../../middleware/validateRequest';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../Auth/auth.constant';
import { ProductController } from './product.controller';

const router = Router();

router.post(
  '/create-product',
  auth(USER_ROLE.admin),
  validateRequest(productValidationSchemas.productValidationSchemaforCreate),
  ProductController.createProduct,
);

router.patch(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(productValidationSchemas.productValidationSchemaforUpdate),
  ProductController.updateProductInformation,
);

router.delete(
  '/:id',
  auth(USER_ROLE.admin),
  ProductController.deleteSingleProduct,
);

router.get('/:id', ProductController.getSingleProduct);

router.get('/', ProductController.getAllProduct);

export const ProductRoutes = router;
