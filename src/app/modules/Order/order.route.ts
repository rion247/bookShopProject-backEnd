import { Router } from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../Auth/auth.constant';
import validateRequest from '../../middleware/validateRequest';
import { orderValidationSchemas } from './order.validation';
import { OrderController } from './order.controller';

const router = Router();

router.get('/my-order', auth(USER_ROLE.user), OrderController.getMyOrder);

router.post(
  '/create-order',
  auth(USER_ROLE.user),
  validateRequest(orderValidationSchemas.orderValidationSchemaforCreate),
  OrderController.createOrder,
);

router.patch(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(
    orderValidationSchemas.orderValidationSchemaforUpdateOrderStatus,
  ),
  OrderController.updateOrderStatus,
);

router.get('/:id', auth(USER_ROLE.admin), OrderController.getSingleOrder);

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.user),
  OrderController.getAllOrder,
);

export const OrderRoutes = router;
