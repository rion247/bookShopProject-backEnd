import z from 'zod';

const authValidationSchemaforLogIn = z.object({
  body: z.object({
    email: z.string({ message: 'User Email is required' }),
    password: z.string({ message: 'Password is required' }),
  }),
});

export const authValidationSchemas = { authValidationSchemaforLogIn };
