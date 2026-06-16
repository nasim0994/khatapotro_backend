import mongoose, { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { IAdmin } from './adminInterface';

const adminSchema = new Schema<IAdmin>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    needsPasswordChange: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      required: true,
    },
    rolePermission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      required: function () {
        return this.role !== 'superAdmin';
      },
    },
    profileUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'blocked'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  },
);

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export const Admin = model<IAdmin>('Admin', adminSchema);
