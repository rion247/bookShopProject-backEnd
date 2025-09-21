import { Router } from 'express';
import { UserController } from './user.controller';
import validateRequest from '../../middleware/validateRequest';
import { userValidationSchemas } from './user.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../Auth/auth.constant';

const router = Router();

router.get('/me', auth(USER_ROLE.admin, USER_ROLE.user), UserController.getMe);

router.post(
  '/create-user',
  validateRequest(userValidationSchemas.userValidationSchemaforCreate),
  UserController.createUser,
);

router.patch(
  '/change-status/:email',
  auth(USER_ROLE.admin),
  validateRequest(userValidationSchemas.userStatusChangeValidationSchema),
  UserController.changeUserStatus,
);

router.patch(
  '/:email',
  auth(USER_ROLE.user),
  validateRequest(userValidationSchemas.updateUserProfileValidationSchema),
  UserController.updateUserProfile,
);

router.get('/:email', auth(USER_ROLE.admin), UserController.getSingleUser);

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.user),
  UserController.getAllUser,
);

export const UserRoutes = router;
