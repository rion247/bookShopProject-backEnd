import { Router } from 'express';
import { UserController } from './user.controller';
import validateRequest from '../../middleware/validateRequest';
import { userValidationSchemas } from './user.validation';

const router = Router();

router.post(
  '/create-user',
  validateRequest(userValidationSchemas.userValidationSchemaforCreate),
  UserController.createUser,
);

export const UserRoutes = router;
