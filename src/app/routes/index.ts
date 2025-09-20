import { Router } from 'express';
import { UserRoutes } from '../modules/User/user.route';
import { AuthRoutes } from './../modules/Auth/auth.route';
import { ProductRoutes } from '../modules/Product/product.route';
import { OrderRoutes } from '../modules/Order/order.route';

const router = Router();

const moduleRoutes = [
  { path: '/users', route: UserRoutes },
  { path: '/auth', route: AuthRoutes },
  { path: '/product', route: ProductRoutes },
  { path: '/order', route: OrderRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
