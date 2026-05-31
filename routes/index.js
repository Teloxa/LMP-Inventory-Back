import routerx from 'express-promise-router';
import userRouter from './user_routes.js';
import productRouter from './product_routes.js';
import providerRouter from './provider_routes.js'; 
import shopRouter from './shop_routes.js';
import orderRouter from './order_routes.js';

const router = routerx();

//router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/products', productRouter);
router.use('/providers', providerRouter);
router.use('/shops', shopRouter);
router.use('/orders', orderRouter);

export default router;
