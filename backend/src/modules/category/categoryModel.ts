import { model, Schema } from 'mongoose';
import { ICategory } from './categoryInterface';

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    icon: {
      color: { type: String, required: true },
      family: { type: String, required: true },
      name: { type: String, required: true },
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
    },
  },
  {
    timestamps: true,
  },
);

export const Category = model<ICategory>('Category', categorySchema);
