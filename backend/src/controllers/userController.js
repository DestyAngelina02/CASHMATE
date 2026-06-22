import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Get all users
export const getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        roleId: true,
        createdAt: true,
        role: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });
    res.json({ status: 'success', data: users });
  } catch (error) {
    next(error);
  }
};

// Create a new user
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, roleId } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roleId: parseInt(roleId, 10),
      },
      select: {
        id: true,
        name: true,
        email: true,
        roleId: true,
        createdAt: true,
      }
    });

    res.status(201).json({ status: 'success', data: newUser });
  } catch (error) {
    next(error);
  }
};

// Update user
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, roleId, password } = req.body;

    const dataToUpdate = { name, email };
    if (roleId) dataToUpdate.roleId = parseInt(roleId, 10);
    if (password) {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id, 10) },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        roleId: true,
        updatedAt: true,
      }
    });

    res.json({ status: 'success', data: updatedUser });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    next(error);
  }
};

// Delete user
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id: parseInt(id, 10) },
    });

    res.json({ status: 'success', message: 'User deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    next(error);
  }
};
