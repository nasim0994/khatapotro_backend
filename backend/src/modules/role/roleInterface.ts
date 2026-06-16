export interface IPermission {
  route: string;
  all: boolean;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

export interface IRole {
  name: string;
  panel: 'admin' | 'employee' | 'hr' | 'accounts';
  permissions: IPermission[];
}
