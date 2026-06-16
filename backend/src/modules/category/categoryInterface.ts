import { Types } from 'mongoose';

export type ICategory = {
  name: string;
  icon: {
    color: string;
    family: string;
    name: string;
  };
  user: Types.ObjectId;
  type: 'income' | 'expense';
};
