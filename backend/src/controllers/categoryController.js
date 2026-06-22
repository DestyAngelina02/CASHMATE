import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      }
    });
    res.json({ status: 'success', data: categories });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    
    const existing = await prisma.category.findUnique({ where: { name } });
    if (existing) {
      return res.status(400).json({ status: 'error', message: 'Category name already exists' });
    }

    const newCategory = await prisma.category.create({
      data: { name }
    });

    res.status(201).json({ status: 'success', data: newCategory });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updatedCategory = await prisma.category.update({
      where: { id: parseInt(id, 10) },
      data: { name }
    });

    res.json({ status: 'success', data: updatedCategory });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ status: 'error', message: 'Category not found' });
    }
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({
      where: { id: parseInt(id, 10) }
    });
    res.json({ status: 'success', message: 'Category deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ status: 'error', message: 'Category not found' });
    }
    // Handle foreign key constraint error if products exist
    if (error.code === 'P2003') {
       return res.status(400).json({ status: 'error', message: 'Cannot delete category because it has related products.' });
    }
    next(error);
  }
};
