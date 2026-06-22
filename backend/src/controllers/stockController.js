import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getStockMovements = async (req, res) => {
  try {
    const movements = await prisma.stockMovement.findMany({
      include: { product: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    res.json({ status: 'success', data: movements });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const createStockMovement = async (req, res) => {
  const { productId, type, quantity, reason } = req.body;
  try {
    const product = await prisma.product.findUnique({ where: { id: Number(productId) } });
    if (!product) return res.status(404).json({ status: 'error', message: 'Produk tidak ditemukan' });

    let newStock = product.stock;
    if (type === 'IN') newStock += Number(quantity);
    else if (type === 'OUT') {
      if (product.stock < Number(quantity)) return res.status(400).json({ status: 'error', message: 'Stok tidak mencukupi' });
      newStock -= Number(quantity);
    } else if (type === 'ADJUSTMENT') {
      newStock = Number(quantity);
    }

    const [movement] = await prisma.$transaction([
      prisma.stockMovement.create({
        data: { productId: Number(productId), type, quantity: Number(quantity), reason }
      }),
      prisma.product.update({
        where: { id: Number(productId) },
        data: { stock: newStock }
      })
    ]);

    res.status(201).json({ status: 'success', data: movement });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
