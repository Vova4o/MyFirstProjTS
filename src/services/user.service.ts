import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

class UserService {
    public async findUserByEmail(email: string): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });
        return user;
    }

    public async findAllUsers(): Promise<User[]> {
        const users = await prisma.user.findMany();
        return users;
    }

    public async showUserProducts(userId: number): Promise<any> {
        const products = await prisma.product.findMany({
            where: {
                id: userId
            },
            include: {
                category: true
            }
        });
        return products;
    }
}
export default new UserService();
   