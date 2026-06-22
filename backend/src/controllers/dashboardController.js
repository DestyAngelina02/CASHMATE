import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDashboardStats = async (req, res, next) => {
  try {
    const totalProducts = await prisma.product.count();
    const totalUsers = await prisma.user.count();
    const totalCustomers = await prisma.customer.count();
    
    // Aggregations for transactions
    const transactionsAggregate = await prisma.transaction.aggregate({
      _count: {
        id: true,
      },
      _sum: {
        grandTotal: true,
      }
    });

    res.json({
      status: 'success',
      data: {
        totalProducts,
        totalUsers,
        totalCustomers,
        totalTransactions: transactionsAggregate._count.id || 0,
        totalRevenue: transactionsAggregate._sum.grandTotal || 0,
      }
    });
  } catch (error) {
    next(error);
  }
};
