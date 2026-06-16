import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import QueryBuilder from '../../builders/QueryBuilder';
import { IUser } from './userInterface';
import { User } from './userModel';
import { sendMail } from '../../utils/sendMail';

import mongoose from 'mongoose';
import { Transaction } from '../transaction/transactionModel';
import { Category } from '../category/categoryModel';

export const getAllUserService = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(User.find(), query)
    .search(['name', 'email'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await userQuery.countTotal();
  const data = await userQuery.modelQuery;

  return {
    meta,
    data,
  };
};

export const getSingleUserService = async (id: string) => {
  const result = await User.findById(id);
  return result;
};

export const updateUserService = async (id: string, data: IUser) => {
  const isExist = await User.findById(id);
  if (!isExist) throw new AppError(httpStatus.NOT_FOUND, 'User not found!');

  const result = await User.findByIdAndUpdate(id, data, { new: true });
  return result;
};

export const deleteUserService = async (id: string) => {
  const isExist = await User.findById(id);
  if (!isExist) throw new AppError(httpStatus.NOT_FOUND, 'User not found!');

  const result = await User.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

export const updateProfileService = async (id: string, data: IUser) => {
  const isExist = await User.findById(id);
  if (!isExist) throw new AppError(httpStatus.NOT_FOUND, 'User not found!');

  const result = await User.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true },
  );
  return result;
};

export const updatePasswordService = async (
  id: string,
  data: { oldPassword: string; newPassword: string },
) => {
  const isExist = await User.findById(id).select('+password');
  if (!isExist) throw new AppError(httpStatus.NOT_FOUND, 'User not found!');

  const { oldPassword, newPassword } = data;
  const isMatch = await bcrypt.compare(oldPassword, isExist?.password);
  if (!isMatch)
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Current Password do not matched',
    );

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(newPassword, salt);
  const newData = { password: hashPassword };

  const result = await User.findByIdAndUpdate(id, newData, { new: true });
  return result;
};

export const permanentDeleteUserService = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const isExist = await User.findById(id).session(session);

    if (!isExist) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    // Delete all transactions of the user
    await Transaction.deleteMany({ user: id }, { session });

    // Delete all categories of the user
    await Category.deleteMany({ user: id }, { session });

    // Delete the user
    await User.findByIdAndDelete(id).session(session);

    await session.commitTransaction();
    return null;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const updatePasswordBySuperUserService = async (
  id: string,
  data: { newPassword: string },
) => {
  const isExist = await User.findById(id).select('+password');
  if (!isExist) throw new AppError(httpStatus.NOT_FOUND, 'User not found!');

  const { newPassword } = data;

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(newPassword, salt);
  const newData = { password: hashPassword };

  const result = await User.findByIdAndUpdate(id, newData, { new: true });
  return result;
};
