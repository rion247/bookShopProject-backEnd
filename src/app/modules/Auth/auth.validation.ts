import z from 'zod';

const authValidationSchemaforLogIn = z.object({
  body: z.object({
    email: z.string({ message: 'User Email is required' }),
    password: z.string({ message: 'Password is required' }),
  }),
});

const authValidationSchemaforChangePassword = z.object({
  body: z.object({
    currentPassword: z.string({ message: 'Current Password is required' }),
    newPassword: z.string({ message: 'New Password is required' }),
  }),
});

const authValidationSchemaforRefreshToken = z.object({
  cookies: z.object({
    refreshToken: z.string({ message: 'Refresh Token is required' }),
  }),
});

export const authValidationSchemas = {
  authValidationSchemaforLogIn,
  authValidationSchemaforChangePassword,
  authValidationSchemaforRefreshToken,
};
