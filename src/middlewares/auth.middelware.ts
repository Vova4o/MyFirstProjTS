import { Request, Response, NextFunction } from 'express';
import userService from '../services/user.service';
import authService from '../services/auth.service';

const authMiddleware = async (req: any, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies['Authorisation'];
    console.log('token', token);
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized by cookie' });
    }

    const userResp = authService.verifyToken(token);
    if (!userResp) {
      return res.status(401).json({ error: 'Unauthorized by verification' });
    }
    console.log('userResp', userResp);

    const userCheckDB = await userService.findUserById(userResp.id);
    if (!userCheckDB) {
      return res.status(401).json({ error: 'Unauthorized by DB' });
    }

    req.user = userCheckDB;

    next();
  } catch (error) {
    console.log('internal server error', error);
    return res.status(500).json({ error: 'Internal server error auth' });
  }
};

export default authMiddleware;
