import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { Role } from '../role/roleModel';
import bcrypt from 'bcrypt';
import QueryBuilder from '../../builders/QueryBuilder';
import { IAdmin } from './adminInterface';
import { Admin } from './adminModel';

export const addAdminService = async (data: IAdmin) => {
  const isRoleExist = await Role.findOne({ _id: data?.role });
  if (!isRoleExist) throw new AppError(httpStatus.NOT_FOUND, 'Role not found!');

  const newData = {
    ...data,
    role: isRoleExist?.name,
    rolePermission: data?.role,
  };

  const result = await Admin.create(newData);
  return result;
};

export const getAllAdminService = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(Admin.find(), query)
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

export const getSingleAdminService = async (id: string) => {
  const result = await Admin.findById(id)
    .populate('employee', 'name profilePictureUrl')
    .populate('rolePermission');
  return result;
};

export const updateAdminService = async (id: string, data: IAdmin) => {
  const isExist = await Admin.findById(id);
  if (!isExist) throw new AppError(httpStatus.NOT_FOUND, 'Admin not found!');

  const isRoleExist = await Role.findOne({ _id: data?.role });
  if (!isRoleExist) throw new AppError(httpStatus.NOT_FOUND, 'Role not found!');

  const newData = {
    ...data,
    role: isRoleExist?.name,
    rolePermission: data?.role,
  };

  const result = await Admin.findByIdAndUpdate(id, newData, { new: true });
  return result;
};

export const deleteAdminService = async (id: string, user: string) => {
  const isExist = await Admin.findById(id);
  if (!isExist) throw new AppError(httpStatus.NOT_FOUND, 'Admin not found!');

  if (isExist?.role === 'superAdmin')
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You cannot delete Super Admin user!',
    );

  const result = await Admin.findByIdAndUpdate(
    id,
    { isDeleted: true, deletedBy: user },
    { new: true },
  );
  return result;
};

export const updateProfileService = async (id: string, data: IAdmin) => {
  const isExist = await Admin.findById(id);
  if (!isExist) throw new AppError(httpStatus.NOT_FOUND, 'Admin not found!');

  const result = await Admin.findByIdAndUpdate(id, data, { new: true });
  return result;
};

export const updatePasswordService = async (
  id: string,
  data: { oldPassword: string; newPassword: string },
) => {
  const isExist = await Admin.findById(id).select('+password');
  if (!isExist) throw new AppError(httpStatus.NOT_FOUND, 'Admin not found!');

  const { oldPassword, newPassword } = data;
  const isMatch = await bcrypt.compare(oldPassword, isExist?.password);
  if (!isMatch)
    throw new AppError(httpStatus.UNAUTHORIZED, 'Password do not matched');

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(newPassword, salt);
  const newData = { password: hashPassword };

  const result = await Admin.findByIdAndUpdate(id, newData, { new: true });
  return result;
};

export const updatePasswordBySuperAdminService = async (
  id: string,
  data: { newPassword: string },
) => {
  const isExist = await Admin.findById(id).select('+password');
  if (!isExist) throw new AppError(httpStatus.NOT_FOUND, 'Admin not found!');

  const { newPassword } = data;

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(newPassword, salt);
  const newData = { password: hashPassword };

  const result = await Admin.findByIdAndUpdate(id, newData, { new: true });
  return result;
};

export const bulkBackAdminService = async (ids: string[]) => {
  const result = await Admin.updateMany(
    { _id: { $in: ids } },
    { $set: { isDeleted: false } },
  );
  return result;
};
