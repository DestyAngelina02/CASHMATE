import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get settings
export const getSettings = async (req, res) => {
  try {
    let settings = await prisma.setting.findFirst();
    if (!settings) {
      // Create default if not exists
      settings = await prisma.setting.create({
        data: {
          storeName: 'CASHMATE STORE',
          taxRate: 0.00,
          currency: 'IDR'
        }
      });
    }
    res.json({ status: 'success', data: settings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Update settings
export const updateSettings = async (req, res) => {
  const { storeName, address, phone, taxRate, currency, receiptNote } = req.body;
  try {
    const settings = await prisma.setting.findFirst();
    const updated = await prisma.setting.update({
      where: { id: settings ? settings.id : 1 },
      data: {
        storeName,
        address,
        phone,
        taxRate: taxRate ? parseFloat(taxRate) : 0,
        currency,
        receiptNote
      }
    });
    res.json({ status: 'success', data: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};
