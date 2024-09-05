import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import { User } from '@prisma/client';

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY_ENV || "mysecretphrase"; //getting from .env

class AuthService {
    public generateToken(user: User): string {
        try {
            // Генерация JWT токена
            const payload = {
                id: user.id
            };

            const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '12h' });
            return token;
        } catch (error) {
            console.log(error);
            return "";
        }
    }

    public verifyToken(token: string): User {
        try {
            // Проверка JWT токена
            const payload: User = jwt.verify(token, SECRET_KEY) as User;
            return payload;
        } catch (error) {
            console.log(error);
            return {} as User;
        }
    }

    public decodeToken(token: string): User {
        try {
            // Декодирование JWT токена
            const payload = jwt.decode(token) as User;
            return payload;
        } catch (error) {
            console.log(error);
            return {} as User;
        }
    }

    /** 
     * Check token
     * @param token
     * @returns
    */
    public checkToken(token: string): boolean {
        // Проверка JWT токена
        try {
            jwt.verify(token, SECRET_KEY);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    /**
     * Get token from headers
     * @param headers 
     * @returns 
     */
    public getTokenFromHeaders(headers: any): string {
        try {
            // Получение JWT токена из заголовков запроса
            const token = headers.authorization.split(" ")[1];
            return token;
        } catch (error) {
            console.log(error);
            return "";
        }
    }

    /**
     * Get token from query
     * @param query 
     * @returns 
     */
    public getTokenFromQuery(query: any): string {
        try {
            // Получение JWT токена из query параметров
            const token = query.token;
            return token;
        } catch (error) {
            console.log(error);
            return "";
        }
    }

    /**
     * Get token from cookies
     * @param cookies 
     * @returns 
     */
    public getTokenFromCookies(cookies: any): string {
        try {
            // Получение JWT токена из cookies
            const token = cookies.token;
            return token;
        } catch (error) {
            console.log(error);
            return "";
        }
    }

}

export default new AuthService;