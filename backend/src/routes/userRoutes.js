import express from 'express';
import { loginUser, getUsers, createUser, updateUser, deleteUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/login', loginUser);
router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
