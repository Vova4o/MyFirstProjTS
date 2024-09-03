import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

class UserService {
    public async findUserByEmail(email: string): Promise<User | null> {
        const user = prisma.user.findUnique({
            where: {
                email
            }
        });
        return user;
    }

    public async findAllUsers(): Promise<User[]> {
        const users = prisma.user.findMany();
        return users;
    }

    public async showUserProducts(userId: number): Promise<any> {
        const products = prisma.product.findMany({
            where: {
                id: userId
            }
        });
        return products;
    }
}
export default new UserService();
   