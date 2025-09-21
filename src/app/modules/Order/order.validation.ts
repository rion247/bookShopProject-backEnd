import z from 'zod';
import { orderStatusArray } from './order.constant';

const orderValidationSchemaforCreate = z.object({
  body: z.object({
    orderQuantity: z.number({ message: 'Order Quantity is required!!!' }),
  }),
});

const orderValidationSchemaforUpdateOrderStatus = z.object({
  body: z.object({
    orderStatus: z.enum([...orderStatusArray] as [string, ...string[]], {
      message: 'Order Status is required!!!',
    }),
  }),
});

export const orderValidationSchemas = {
  orderValidationSchemaforCreate,
  orderValidationSchemaforUpdateOrderStatus,
};
