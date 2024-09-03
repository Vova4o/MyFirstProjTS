import { Request, Response, NextFunction } from 'express';
import userService from '../services/user.service';

const authMiddleware = async (req: any, res: Response, next: NextFunction) => {
  try {
    const email = req.query.email as string;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const userResp = await userService.findUserByEmail(email);

    if (!userResp) {
      return res.status(404).json({ error: 'User not found' });
    }

    req.user = userResp;

    next();
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default authMiddleware;