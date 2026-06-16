import config from '../config';
import { verifyToken } from '../utils/createToken';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import { catchAsync } from '../utils/catchAsync';
import { NextFunction, Request, Response } from 'express';
import { IPermission } from '../modules/role/roleInterface';
import { Admin } from '../modules/admin/adminModel';
import { IPopulateAdmin } from '../modules/admin/adminInterface';

export const verifyPermission = (route: string, action: string) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers?.authorization?.split(' ')[1];

    // checking if the token is missing
    if (!token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You are not authorized! missing token',
      );
    }

    // checking if the given token is valid
    let decoded;
    try {
      decoded = verifyToken(token, config.JWT_ACCESS_SECRET as string);
    } catch {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You are not authorized! invalid token',
      );
    }

    const { role, _id } = decoded;

    // checking if the user is exist
    const user = (await Admin.findById(_id).populate(
      'rolePermission',
    )) as IPopulateAdmin;

    // checking superAdmin
    if (role === 'superAdmin') return next();

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
    }

    // checking status
    const status = user?.status;
    if (status === 'blocked') {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked !');
    }

    const permissions = user?.rolePermission?.permissions;

    // checking if the user has permission
    const permission = permissions?.find(
      (perm: IPermission) => perm?.route === route,
    );

    if (!permission || !permission[action as keyof IPermission]) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        `You do not have permission to ${action} on ${route} route`,
      );
    }

    next();
  });
};
