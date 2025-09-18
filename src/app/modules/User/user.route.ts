import { Router } from 'express';
import { UserController } from './user.controller';
import validateRequest from '../../middleware/validateRequest';
import { userValidationSchemas } from './user.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../Auth/auth.constant';

const router = Router();

router.patch(
  '/change-status/:email',
  auth(USER_ROLE.admin),
  validateRequest(userValidationSchemas.userStatusChangeValidationSchema),
  UserController.changeUserStatus,
);

router.post(
  '/create-user',
  validateRequest(userValidationSchemas.userValidationSchemaforCreate),
  UserController.createUser,
);

export const UserRoutes = router;
