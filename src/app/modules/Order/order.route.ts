import { Router } from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../Auth/auth.constant';
import validateRequest from '../../middleware/validateRequest';
import { orderValidationSchemas } from './order.validation';
import { OrderController } from './order.controller';

const router = Router();

router.post(
  '/create-product',
  auth(USER_ROLE.user),
  validateRequest(orderValidationSchemas.orderValidationSchemaforCreate),
  OrderController.createOrder,
);

export const OrderRoutes = router;
