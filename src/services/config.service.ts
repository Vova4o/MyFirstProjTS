import dotenv from 'dotenv';

// Загрузка переменных окружения из файла .env
dotenv.config();

class ConfigService {
    private readonly envConfig: { [key: string]: string | undefined };

    constructor() {
        this.envConfig = process.env;
    }

    get(key: string): string | undefined {
        try {
            return this.envConfig[key];
        } catch (error) {
            console.log(error);
            throw new Error(`Missing environment variable: ${key}`);
        }
    }

    getOrThrow(key: string): string {
        const value = this.envConfig[key];
        if (!value) {
            throw new Error(`Missing environment variable: ${key}`);
        }
        return value;
    }
}

export default new ConfigService();