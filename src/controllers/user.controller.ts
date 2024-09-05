import { Request, Response } from 'express';
import userService from '../services/user.service'; // Убедитесь, что путь к файлу правильный

export const getUser = (req: any, res: Response) => {
  return res.send('This is a GET request for a user route');
};

export const getAllUsers = async (req: any, res: Response) => {
  try {
    const users = await userService.findAllUsers();
    return res.json(users);
  } catch (error: any) {
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};

export const showUserProducts = async (req: any, res: Response) => {
  try {
    const user = req.user;

    const products = await userService.showUserProducts(user.id);
    if (products.length === 0) {
      return res.status(204).json({ message: 'No content...' });
    }
    return res.status(200).json({
      products,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};
