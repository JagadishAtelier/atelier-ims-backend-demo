import express from 'express';
import productRoutes from './product/routes/index.js';
import orderRoutes from './order/routes/index.js';
import vendorRoutes from './vendor/routes/index.js';

const router = express.Router();

router.use('/ims', productRoutes);
router.use('/ims', orderRoutes);
router.use('/ims', vendorRoutes);

export default router;