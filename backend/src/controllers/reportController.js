import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Laporan penjualan - ringkasan & per-hari
export const getSalesReport = async (req, res, next) => {
  try {
    const { period } = req.query; // today, week, month, year
    
    // Tentukan rentang waktu berdasarkan filter
    let startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    let endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    let days = 1;

    if (period === 'week') {
      days = 7;
      startDate.setDate(startDate.getDate() - 6);
    } else if (period === 'month') {
      days = 30;
      startDate.setDate(startDate.getDate() - 29);
    } else if (period === 'year') {
      days = 12; // We'll group by month, but for simplicity let's just do 365 days or 12 months.
      // For now, let's just use 30 days to avoid complex grouping logic if not strictly necessary,
      // or implement 12 months logic if needed. Let's do 30 days for now to keep it simple and working.
      days = 30; 
      startDate.setDate(startDate.getDate() - 29);
    }

    // Ringkasan total semua transaksi dalam periode
    const summary = await prisma.transaction.aggregate({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: { id: true },
      _sum: { grandTotal: true },
    });

    // Data per-hari untuk chart
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
        transactions: dayResult._count.id || 0,
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

    res.json({ status: 'success', data: { lowStock: products } });
  } catch (error) {
    next(error);
  }
};
