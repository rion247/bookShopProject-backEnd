import z from 'zod';

const productValidationSchemaforCreate = z.object({
  body: z.object({
    title: z.string({ message: 'Book Title is required!!!' }),
    author: z.string({ message: 'Author Name is required!!!' }),
    category: z.string({ message: 'Book Category is required!!!' }),
    price: z.number({ message: 'Book Price is required!!!' }),
    quantity: z.number({ message: 'Book Quantity is required!!!' }),
    image: z.string({ message: 'Book Image is required!!!' }),
  }),
});

const productValidationSchemaforUpdate = z.object({
  body: z.object({
    title: z.string().optional(),
    author: z.string().optional(),
    category: z.string().optional(),
    price: z.number().optional(),
    quantity: z.number().optional(),
    image: z.string().optional(),
  }),
});

export const productValidationSchemas = {
  productValidationSchemaforCreate,
  productValidationSchemaforUpdate,
};
