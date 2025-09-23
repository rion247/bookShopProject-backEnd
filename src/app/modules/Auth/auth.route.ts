import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { authValidationSchemas } from './auth.validation';
import { AuthController } from './auth.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from './auth.constant';

const router = Router();

router.post(
  '/login',
  validateRequest(authValidationSchemas.authValidationSchemaforLogIn),
  AuthController.loginUser,
);

router.post(
  '/change-password',
  auth(USER_ROLE.admin, USER_ROLE.user),
  validateRequest(authValidationSchemas.authValidationSchemaforChangePassword),
  AuthController.changePassword,
);

router.post(
  '/refresh-token',
  auth(USER_ROLE.admin, USER_ROLE.user),
  validateRequest(authValidationSchemas.authValidationSchemaforRefreshToken),
  AuthController.refreshToken,
);

export const AuthRoutes = router;
