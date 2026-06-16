import { Types } from 'mongoose';

export type ITransaction = {
  user: Types.ObjectId;
  category: Types.ObjectId;
  type: 'income' | 'expense';
  amount: number;
  date: Date;
  note?: string;
};
