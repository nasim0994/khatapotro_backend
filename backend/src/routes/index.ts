import { Router } from 'express';
const router = Router();
import { authRoute } from '../modules/auth/authRoute';
import { roleRoute } from '../modules/role/roleRoute';
import { adminRoute } from '../modules/admin/adminRoute';
import { userRoute } from '../modules/user/userRoute';
import { userAuthRoute } from '../modules/userAuth/userAuthRoute';
import { categoryRoute } from '../modules/category/categoryRoute';
import { transactionRoute } from '../modules/transaction/transactionRoute';
import { reportRoute } from '../modules/report/reportRoute';

const moduleRoutes = [
  {
    path: '/auth',
    route: authRoute,
    permissionRoute: false,
  },
  {
    path: '/admin',
    route: adminRoute,
    permissionRoute: true,
  },
  {
    path: '/role',
    route: roleRoute,
    permissionRoute: true,
  },
  {
    path: '/user',
    route: userRoute,
    permissionRoute: true,
  },
  {
    path: '/user-auth',
    route: userAuthRoute,
    permissionRoute: false,
  },
  {
    path: '/category',
    route: categoryRoute,
    permissionRoute: false,
  },
  {
    path: '/transaction',
    route: transactionRoute,
    permissionRoute: false,
  },
  {
    path: '/report',
    route: reportRoute,
    permissionRoute: false,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

router.get('/permission-routes/all', (req, res) => {
  const routes = moduleRoutes
    .filter((route) => route.permissionRoute)
    .map((route) => route.path.replace('/', ''));

  res.json({
    success: true,
    message: 'All routes get success',
    data: routes,
  });
});

export default router;
