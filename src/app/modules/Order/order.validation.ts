import z from 'zod';

const orderValidationSchemaforCreate = z.object({
  body: z.object({
    orderQuantity: z.number({ message: 'Order Quantity is required!!!' }),
  }),
});

export const orderValidationSchemas = {
  orderValidationSchemaforCreate,
};
