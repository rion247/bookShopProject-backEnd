import z from 'zod';
import { UserRoleForEnum, UserStatus } from './user.constant';

const userValidationSchemaforCreate = z.object({
  body: z.object({
    password: z
      .string()
      .max(20, { message: 'Password should not exceed 20 character!!!' })
      .optional(),

    user: z.object({
      name: z.string({ message: 'User Name is required' }),
      email: z.email({ message: 'User Email is required' }),
      password: z.string().optional(),
    }),
  }),
});

const userStatusChangeValidationSchema = z.object({
  body: z.object({
    status: z.enum([...UserStatus] as [string, ...string[]]),
  }),
});

const userRoleChangeValidationSchema = z.object({
  body: z.object({
    role: z.enum([...UserRoleForEnum] as [string, ...string[]]),
  }),
});

const updateUserProfileValidationSchema = z.object({
  body: z
    .object({
      name: z.string({ message: 'User Name is required' }),
    })
    .strict()
    .superRefine((val, ctx) => {
      const allowedKeys = ['name'];
      Object.keys(val).forEach((key) => {
        if (!allowedKeys.includes(key)) {
          ctx.addIssue({
            code: 'custom',
            message: 'Only name can be updated. Other fields are not allowed.',
            path: [key],
          });
        }
      });
    }),
});

export const userValidationSchemas = {
  userValidationSchemaforCreate,
  userStatusChangeValidationSchema,
  updateUserProfileValidationSchema,
  userRoleChangeValidationSchema,
};
