import { Router } from 'express';
import { getUser, showUserProducts } from '../controllers/user.controller';
import authMiddleware from '../middlewares/auth.middelware';

const user = Router();

user.get('/', authMiddleware, getUser);

// user.get('/all', authMiddleware, getAllUsers);
// user.get('/all', getall);

user.get('/products', authMiddleware, showUserProducts);

export default user;
