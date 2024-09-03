import { Router } from 'express';
import { getUser, getAllUsers, showUserProducts } from '../controllers/user.controller';
import authMiddleware from '../middlewares/auth.middelware';

const user = Router();

user.get('/', authMiddleware, getUser);

user.get('/all', getAllUsers);

user.get('/products', authMiddleware, showUserProducts);

export default user;