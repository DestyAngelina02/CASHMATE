import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import { uploadToSupabase, deleteFromSupabase } from '../utils/supabase.js';

const prisma = new PrismaClient();

export const getProducts = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: { select: { id: true, name: true } },
        supplier: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ status: 'success', data: products });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        category: true,
        supplier: true,
      }
    });

    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }

    res.json({ status: 'success', data: product });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { name, barcode, price, stock, categoryId, supplierId } = req.body;
    let imageUrl = null;

    if (req.file) {
      try {
        imageUrl = await uploadToSupabase(req.file.buffer, req.file.originalname, req.file.mimetype);
      } catch (uploadError) {
        console.warn('[WARN] Image upload failed, saving product without image:', uploadError.message);
        // Tetap lanjutkan simpan produk tanpa gambar
        imageUrl = null;
      }
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        barcode: barcode || null,
        price: parseFloat(price),
        stock: parseInt(stock, 10),
        categoryId: categoryId ? parseInt(categoryId, 10) : null,
        supplierId: supplierId ? parseInt(supplierId, 10) : null,
        image: imageUrl
      }
    });

    res.status(201).json({ status: 'success', data: newProduct });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, barcode, price, stock, categoryId, supplierId } = req.body;

    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id, 10) }
    });

    if (!existingProduct) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }

    let imageUrl = existingProduct.image;

    // Jika ada file gambar baru yang diunggah
    if (req.file) {
      try {
        const newImageUrl = await uploadToSupabase(req.file.buffer, req.file.originalname, req.file.mimetype);
        // Hapus gambar lama jika ada
        if (existingProduct.image) {
          await deleteFromSupabase(existingProduct.image);
        }
        imageUrl = newImageUrl;
      } catch (uploadError) {
        console.warn('[WARN] Image upload failed, keeping existing image:', uploadError.message);
        // Tetap gunakan gambar lama
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id, 10) },
      data: {
        name,
        barcode: barcode || null,
        price: parseFloat(price),
        stock: parseInt(stock, 10),
        categoryId: categoryId ? parseInt(categoryId, 10) : null,
        supplierId: supplierId ? parseInt(supplierId, 10) : null,
        image: imageUrl
      }
    });

    res.json({ status: 'success', data: updatedProduct });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id, 10) }
    });

    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }

    await prisma.product.delete({
      where: { id: parseInt(id, 10) }
    });

    // Hapus gambar jika ada
    if (product.image) {
      await deleteFromSupabase(product.image);
    }

    res.json({ status: 'success', message: 'Product deleted successfully' });
  } catch (error) {
    if (error.code === 'P2003') {
       return res.status(400).json({ status: 'error', message: 'Cannot delete product because it has related transactions or stock movements.' });
    }
    next(error);
  }
};
