import { z } from 'zod';

export const permissionSchema = z.object({
  route: z.string().nonempty('Route is required'),
  all: z.boolean().default(false),
  create: z.boolean().default(false),
  read: z.boolean().default(false),
  update: z.boolean().default(false),
  delete: z.boolean().default(false),
});

export const roleValidation = z.object({
  name: z.string().min(1, 'Role name is required'),
  permissions: z.array(permissionSchema),
});

export const roleUpdateValidation = z.object({
  name: z.string().min(1, 'Role name is required').optional(),
  permissions: z.array(permissionSchema).optional(),
});
