import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builders/QueryBuilder';
import { ITransaction } from './transactionInterface';
import { Transaction } from './transactionModel';

export const addTransactionService = async (
  data: ITransaction,
  loginUserId: string,
) => {
  if (data?.user.toString() !== loginUserId)
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You can not create category for another user',
    );

  const result = await Transaction.create(data);
  return result;
};

export const getAllTransactionService = async (
  query: Record<string, unknown>,
) => {
  const transactionQuery = new QueryBuilder(
    Transaction.find().populate('category user'),
    query,
  )
    .search([''])
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await transactionQuery.countTotal();
  const data = await transactionQuery.modelQuery;

  return {
    meta,
    data,
  };
};

export const getSingleTransactionService = async (id: string) => {
  const result = await Transaction.findById(id).populate('category');
  return result;
};

export const updateTransactionService = async (
  id: string,
  data: ITransaction,
) => {
  const isExist = await Transaction.findById(id);
  if (!isExist)
    throw new AppError(httpStatus.NOT_FOUND, 'Transaction not found!');

  const result = await Transaction.findByIdAndUpdate(id, data, { new: true });
  return result;
};

export const deleteTransactionService = async (id: string) => {
  const isExist = await Transaction.findById(id);
  if (!isExist)
    throw new AppError(httpStatus.NOT_FOUND, 'Transaction not found!');

  // check has transaction with this transaction

  const result = await Transaction.findByIdAndDelete(id);
  return result;
};
