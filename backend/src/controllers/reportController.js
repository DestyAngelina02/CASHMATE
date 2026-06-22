import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Laporan penjualan - ringkasan & per-hari 7 hari terakhir
export const getSalesReport = async (req, res, next) => {
  try {
    // Ringkasan total semua transaksi
    const summary = await prisma.transaction.aggregate({
      _count: { id: true },
      _sum: { grandTotal: true },
    });

    // Data 7 hari terakhir untuk chart
    const days = 7;
    const dailyData = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      const dayResult = await prisma.transaction.aggregate({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        _sum: { grandTotal: true },
        _count: { id: true },
      });

      dailyData.push({
        date: startOfDay.toLocaleDateString('id-ID', { weekday: 'short', day: '2-digit', month: 'short' }),
        revenue: dayResult._sum.grandTotal || 0,
        count: dayResult._count.id || 0,
      });
    }

    // Riwayat transaksi terbaru
    const recentTransactions = await prisma.transaction.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true } },
        customer: { select: { name: true } },
        _count: { select: { items: true } },
      },
    });

    res.json({
      status: 'success',
      data: {
        summary: {
          totalTransactions: summary._count.id || 0,
          totalRevenue: summary._sum.grandTotal || 0,
        },
        dailyData,
        recentTransactions,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Laporan stok menipis
export const getLowStockProducts = async (req, res, next) => {
  try {
    const threshold = parseInt(req.query.threshold, 10) || 10;

    const products = await prisma.product.findMany({
      where: {
        stock: { lte: threshold },
      },
      include: {
        category: { select: { name: true } },
        supplier: { select: { name: true } },
      },
      orderBy: { stock: 'asc' },
    });

    res.json({ status: 'success', data: products });
  } catch (error) {
    next(error);
  }
};
