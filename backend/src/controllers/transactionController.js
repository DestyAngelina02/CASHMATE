import prisma from '../utils/prisma.js';
// Fungsi helper untuk men-generate Invoice Number
const generateInvoiceNumber = async () => {
  const date = new Date();
  const dateStr = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
  
  // Cari transaksi terakhir hari ini
  const lastTransaction = await prisma.transaction.findFirst({
    where: {
      invoiceNo: {
        startsWith: `INV-${dateStr}`
      }
    },
    orderBy: {
      id: 'desc'
    }
  });

  let counter = 1;
  if (lastTransaction) {
    const lastCounterStr = lastTransaction.invoiceNo.split('-').pop();
    counter = parseInt(lastCounterStr, 10) + 1;
  }

  return `INV-${dateStr}-${counter.toString().padStart(4, '0')}`;
};

export const createTransaction = async (req, res, next) => {
  try {
    const { 
      customerId, 
      userId, 
      totalAmount, 
      discount, 
      tax, 
      grandTotal, 
      paidAmount, 
      changeAmount, 
      paymentMethod, 
      items 
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ status: 'error', message: 'Transaction items cannot be empty' });
    }

    // Eksekusi semua operasi database dalam satu transaksi yang atomik
    const result = await prisma.$transaction(async (tx) => {
      const invoiceNo = await generateInvoiceNumber();

      // 1. Buat record Transaksi utama
      const transaction = await tx.transaction.create({
        data: {
          invoiceNo,
          customerId: customerId ? parseInt(customerId, 10) : null,
          userId: parseInt(userId, 10) || 1, // Fallback ke admin jika tidak dikirim (sementara auth belum full)
          totalAmount: parseFloat(totalAmount),
          discount: parseFloat(discount || 0),
          tax: parseFloat(tax || 0),
          grandTotal: parseFloat(grandTotal),
          paidAmount: parseFloat(paidAmount),
          changeAmount: parseFloat(changeAmount),
          paymentMethod: paymentMethod || 'CASH',
        }
      });

      // 2. Loop melalui item, buat TransactionItem dan kurangi Stock
      for (const item of items) {
        const prodId = parseInt(item.productId, 10);
        const qty = parseInt(item.quantity, 10);
        
        // Cek stok saat ini
        const product = await tx.product.findUnique({ where: { id: prodId } });
        if (!product) {
          throw new Error(`Product with ID ${prodId} not found`);
        }
        if (product.stock < qty) {
          throw new Error(`Insufficient stock for product ${product.name}`);
        }

        // Buat TransactionItem
        await tx.transactionItem.create({
          data: {
            transactionId: transaction.id,
            productId: prodId,
            quantity: qty,
            unitPrice: parseFloat(item.unitPrice),
            subtotal: parseFloat(item.subtotal),
          }
        });

        // Kurangi Stok Produk
        await tx.product.update({
          where: { id: prodId },
          data: { stock: product.stock - qty }
        });
      }

      return transaction;
    });

    res.status(201).json({ status: 'success', data: result });
  } catch (error) {
    if (error.message.includes('Insufficient stock')) {
      return res.status(400).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

export const getTransactions = async (req, res, next) => {
  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        user: { select: { name: true } },
        customer: { select: { name: true } },
        _count: { select: { items: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ status: 'success', data: transactions });
  } catch (error) {
    next(error);
  }
};

export const getTransactionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const transaction = await prisma.transaction.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        user: { select: { name: true } },
        customer: { select: { name: true, phone: true } },
        items: {
          include: {
            product: { select: { name: true, barcode: true } }
          }
        }
      }
    });

    if (!transaction) {
      return res.status(404).json({ status: 'error', message: 'Transaction not found' });
    }

    res.json({ status: 'success', data: transaction });
  } catch (error) {
    next(error);
  }
};
