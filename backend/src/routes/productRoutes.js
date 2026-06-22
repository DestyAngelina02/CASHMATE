import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import upload from '../utils/upload.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
// Gunakan middleware upload.single('image') untuk rute POST dan PUT
router.post('/', upload.single('image'), createProduct);
router.put('/:id', upload.single('image'), updateProduct);
router.delete('/:id', deleteProduct);

export default router;
