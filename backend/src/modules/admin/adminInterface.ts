import { Types } from 'mongoose';
import { IRole } from '../role/roleInterface';

export type IAdmin = {
  email: string;
  name: string;
  password: string;
  needsPasswordChange: boolean;
  role: string;
  rolePermission?: Types.ObjectId;
  profileUrl?: string;
  status: 'active' | 'blocked';
};

export type IPopulateAdmin = {
  email: string;
  name: string;
  password: string;
  needsPasswordChange: boolean;
  role: string;
  rolePermission?: IRole;
  status: 'active' | 'blocked';
};
