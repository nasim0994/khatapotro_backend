import AppError from '../../errors/AppError';
import { User } from '../user/userModel';
import { Transaction } from '../transaction/transactionModel';
import httpStatus from 'http-status';
import { Types } from 'mongoose';

type TStatisticsQuery = {
  type: 'income' | 'expense';
  month: string;
};

export const getUserBalanceService = async (id: string) => {
  const isExist = await User.findById(id);
  if (!isExist) throw new AppError(httpStatus.NOT_FOUND, 'User not found!');

  const now = new Date();

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const result = await Transaction.aggregate([
    {
      $match: {
        user: isExist._id,
        date: {
          $gte: startOfMonth,
          $lt: startOfNextMonth,
        },
      },
    },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
      },
    },
  ]);

  let income = 0;
  let expense = 0;

  result.forEach((item) => {
    if (item._id === 'income') income = item.total;
    if (item._id === 'expense') expense = item.total;
  });

  const balance = income - expense;

  const month = `${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;

  return {
    income,
    expense,
    balance,
    month,
  };
};

export const transactionStatisticsService = async (
  id: string,
  query: TStatisticsQuery,
) => {
  const { type, month } = query;

  const isExist = await User.findById(id);

  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  if (!type || !['income', 'expense'].includes(type)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Type must be income or expense',
    );
  }

  if (!month) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Month is required');
  }

  const [monthNumber, yearNumber] = month.split('-').map(Number);

  if (!monthNumber || !yearNumber || monthNumber < 1 || monthNumber > 12) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Invalid month format. Use MM-YYYY',
    );
  }

  const startDate = new Date(yearNumber, monthNumber - 1, 1);
  const endDate = new Date(yearNumber, monthNumber, 1);

  const result = await Transaction.aggregate([
    {
      $match: {
        user: new Types.ObjectId(id),
        type,
        date: {
          $gte: startDate,
          $lt: endDate,
        },
      },
    },
    {
      $group: {
        _id: '$category',
        amount: {
          $sum: '$amount',
        },
      },
    },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'category',
      },
    },
    {
      $unwind: '$category',
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: '$amount',
        },
        categories: {
          $push: {
            category: '$category',
            amount: '$amount',
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        total: 1,
        categories: {
          $map: {
            input: '$categories',
            as: 'item',
            in: {
              category: '$$item.category',
              amount: '$$item.amount',
              percentage: {
                $round: [
                  {
                    $multiply: [
                      {
                        $divide: ['$$item.amount', '$total'],
                      },
                      100,
                    ],
                  },
                  2,
                ],
              },
            },
          },
        },
      },
    },
  ]);

  const data = result[0];

  return {
    type,
    month,
    total: data?.total || 0,
    categories: data?.categories || [],
  };
};
