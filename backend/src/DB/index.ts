/* eslint-disable no-console */
import { IAdmin } from '../modules/admin/adminInterface';
import { Admin } from '../modules/admin/adminModel';

const defaultAdmin: IAdmin = {
  email: 'admin@khatapotro.com',
  name: 'Super Admin',
  password: 'admin@khatapotro.com',
  needsPasswordChange: false,
  role: 'superAdmin',
  status: 'active',
};

export const seedDefaultAdmin = async () => {
  const isSuperAdminExits = await Admin.findOne({ role: 'superAdmin' });

  if (!isSuperAdminExits) {
    const result = await Admin.create(defaultAdmin);
    if (result) {
      console.log('Default superAdmin created successfully');
    }
  }
};
