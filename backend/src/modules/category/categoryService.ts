import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builders/QueryBuilder';
import { ICategory } from './categoryInterface';
import { Category } from './categoryModel';

export const addCategoryService = async (
  data: ICategory,
  loginUserId: string,
) => {
  if (data?.user.toString() !== loginUserId)
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You can not create category for another user',
    );

  const result = await Category.create(data);
  return result;
};

export const getAllCategoryService = async (query: Record<string, unknown>) => {
  const categoryQuery = new QueryBuilder(Category.find(), query)
    .search(['name'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await categoryQuery.countTotal();
  const data = await categoryQuery.modelQuery;

  return {
    meta,
    data,
  };
};

export const getSingleCategoryService = async (id: string) => {
  const result = await Category.findById(id);
  return result;
};

export const updateCategoryService = async (id: string, data: ICategory) => {
  const isExist = await Category.findById(id);
  if (!isExist) throw new AppError(httpStatus.NOT_FOUND, 'Category not found!');

  const result = await Category.findByIdAndUpdate(id, data, { new: true });
  return result;
};

export const deleteCategoryService = async (id: string) => {
  const isExist = await Category.findById(id);
  if (!isExist) throw new AppError(httpStatus.NOT_FOUND, 'Category not found!');

  // check has transaction with this category

  const result = await Category.findByIdAndDelete(id);
  return result;
};
