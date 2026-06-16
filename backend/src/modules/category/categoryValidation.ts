import { z } from 'zod';

export const categoryValidation = z.object({
  name: z.string({ required_error: 'Name is required' }),
  user: z.string({ required_error: 'User is required' }),
});
