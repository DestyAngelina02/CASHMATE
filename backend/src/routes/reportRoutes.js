import express from 'express';
import { getSalesReport, getLowStockProducts } from '../controllers/reportController.js';

const router = express.Router();

router.get('/sales', getSalesReport);
router.get('/low-stock', getLowStockProducts);

export default router;
