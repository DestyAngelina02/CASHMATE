import express from 'express';
import { getStockMovements, createStockMovement } from '../controllers/stockController.js';

const router = express.Router();

router.get('/', getStockMovements);
router.post('/', createStockMovement);

export default router;
