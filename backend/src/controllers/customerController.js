import prisma from '../utils/prisma.js';
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ status: 'success', data: customers });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const createCustomer = async (req, res) => {
  const { name, phone, email, membership } = req.body;
  try {
    const customer = await prisma.customer.create({
      data: { name, phone, email, membership }
    });
    res.status(201).json({ status: 'success', data: customer });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const updateCustomer = async (req, res) => {
  const { id } = req.params;
  const { name, phone, email, membership } = req.body;
  try {
    const customer = await prisma.customer.update({
      where: { id: Number(id) },
      data: { name, phone, email, membership }
    });
    res.json({ status: 'success', data: customer });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const deleteCustomer = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.customer.delete({
      where: { id: Number(id) }
    });
    res.json({ status: 'success', message: 'Customer deleted' });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};
