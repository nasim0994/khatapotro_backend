import mongoose from 'mongoose';
import { z } from 'zod';

export const adminValidation = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  name: z.string().min(1, { message: 'Name is required' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
  role: z
    .string()
    .optional()
    .refine((val) => !val || mongoose.Types.ObjectId.isValid(val), {
      message: 'Invalid rolePermission ObjectId',
    }),
});
