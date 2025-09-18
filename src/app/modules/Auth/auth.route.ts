import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { authValidationSchemas } from './auth.validation';
import { AuthController } from './auth.controller';

const router = Router();

router.post(
  '/login',
  validateRequest(authValidationSchemas.authValidationSchemaforLogIn),
  AuthController.loginUser,
);

export const AuthRoutes = router;
