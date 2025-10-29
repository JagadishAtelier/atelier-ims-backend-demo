import express from 'express';
import labTestRoutes from './labtestsmaster.routes.js';
import labTestOrdersRoutes from './labtestorders.routes.js';
import radiologyOrdersRoutes from './radiologyorders.routes.js';

const router = express.Router();

router.use('/laboratory', labTestRoutes);
router.use('/laboratory', labTestOrdersRoutes);
router.use('/laboratory', radiologyOrdersRoutes);

export default router;