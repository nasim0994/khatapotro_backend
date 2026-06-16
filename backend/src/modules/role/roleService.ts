import AppError from '../../errors/AppError';
import { IRole } from './roleInterface';
import { Role } from './roleModel';
import httpStatus from 'http-status';

export const addRoleService = async (data: IRole) => {
  const result = await Role.create(data);
  return result;
};

export const getAllRoleService = async () => {
  const result = await Role.find();
  return result;
};

export const getSingleRoleService = async (id: string) => {
  const result = await Role.findById(id);
  return result;
};

export const updateRoleService = async (id: string, data: IRole) => {
  const isExist = await Role.findById(id);
  if (!isExist) throw new AppError(httpStatus.NOT_FOUND, 'Role not found!');
  const result = await Role.findByIdAndUpdate(id, data, { new: true });
  return result;
};

export const deleteRoleService = async (id: string) => {
  const isExist = await Role.findById(id);
  if (!isExist) throw new AppError(httpStatus.NOT_FOUND, 'Role not found!');
  const result = await Role.findByIdAndDelete(id);
  return result;
};
