import prisma from '../utils/prisma.js';
export const getSuppliers = async (req, res, next) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      }
    });
    res.json({ status: 'success', data: suppliers });
  } catch (error) {
    next(error);
  }
};

export const createSupplier = async (req, res, next) => {
  try {
    const { name, phone, address } = req.body;
    
    const newSupplier = await prisma.supplier.create({
      data: { name, phone, address }
    });

    res.status(201).json({ status: 'success', data: newSupplier });
  } catch (error) {
    next(error);
  }
};

export const updateSupplier = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, phone, address } = req.body;

    const updatedSupplier = await prisma.supplier.update({
      where: { id: parseInt(id, 10) },
      data: { name, phone, address }
    });

    res.json({ status: 'success', data: updatedSupplier });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ status: 'error', message: 'Supplier not found' });
    }
    next(error);
  }
};

export const deleteSupplier = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.supplier.delete({
      where: { id: parseInt(id, 10) }
    });
    res.json({ status: 'success', message: 'Supplier deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ status: 'error', message: 'Supplier not found' });
    }
    if (error.code === 'P2003') {
       return res.status(400).json({ status: 'error', message: 'Cannot delete supplier because it has related products.' });
    }
    next(error);
  }
};
