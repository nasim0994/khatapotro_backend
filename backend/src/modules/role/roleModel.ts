import mongoose, { Schema } from 'mongoose';
import { IRole } from './roleInterface';
import { User } from '../user/userModel';

const roleSchema = new Schema<IRole>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  panel: {
    type: String,
    enum: ['admin', 'employee', 'hr', 'accounts'],
    required: true,
    default: 'admin',
  },
  permissions: [
    {
      route: { type: String, required: true },
      all: { type: Boolean, default: false },
      create: { type: Boolean, default: false },
      read: { type: Boolean, default: false },
      update: { type: Boolean, default: false },
      delete: { type: Boolean, default: false },
    },
  ],
});

roleSchema.pre('findOneAndDelete', async function (next) {
  const roleId = this.getQuery()._id;
  const userCount = await User.countDocuments({
    rolePermission: roleId,
  });

  if (userCount > 0) {
    const error = new Error(
      'Cannot delete this role with associated user articles.',
    );
    return next(error);
  }

  next();
});

export const Role = mongoose.model<IRole>('Role', roleSchema);
