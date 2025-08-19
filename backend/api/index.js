import { Router } from 'express';
import productsRoutes from './products.js';
import siteRoutes from './site.js';
import usersRoutes from './users.js';
import ordersRoutes from './orders.js';

const router = Router();

router.use('/products', productsRoutes);
router.use('/site', siteRoutes);
router.use('/users', usersRoutes);
router.use('/orders', ordersRoutes);

export default router;
