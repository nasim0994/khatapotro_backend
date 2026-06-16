import { z } from 'zod';

export const transactionValidation = z.object({
  user: z.string({ required_error: 'User is required' }),
  category: z.string({ required_error: 'Category is required' }),
});
