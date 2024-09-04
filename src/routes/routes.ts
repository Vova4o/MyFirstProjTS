import { Router } from 'express';
import user from './user';
import products from './product';
import auth from './auth';

const routes = Router();

routes.use('/user', user);
routes.use('/products', products);
routes.use('/auth', auth);

export default routes;