import z from 'zod';

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

export const userValidationSchemas = { userValidationSchemaforCreate };
