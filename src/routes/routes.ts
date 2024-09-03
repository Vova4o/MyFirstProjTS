import { Router } from 'express';
import user from './user';
import products from './product';

const routes = Router();

routes.use('/user', user);
routes.use('/products', products);

export default routes;