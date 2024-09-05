import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

class UserService {
  public async findUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  public async findUserById(id: number): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      });
      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  public async findAllUsers(): Promise<User[]> {
    try {
      const users: User[] = await prisma.user.findMany();
      return users;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  public async showUserProducts(userId: number): Promise<any> {
    const products = await prisma.product.findMany({
      where: {
        id: userId,
      },
      include: {
        category: true,
      },
    });
    return products;
  }

  public async createUser(email: string, name: string): Promise<User> {
    try {
      console.log('user.service', email, name);
      const user = await prisma.user.create({
        data: {
          name,
          email,
        },
      });
      console.log('User created successfully');
      return user;
    } catch (error) {
      console.log(error);
      return {} as User;
    }
  }

  public async createUserWithPassword(
    email: string,
    password: string
  ): Promise<User | string> {
    try {
      // Проверка на существование пользователя с таким же email
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return 'User with this email already exists';
      }

      // Создание нового пользователя
      const user = await prisma.user.create({
        data: {
          email,
          password,
        },
      });
      return user;
    } catch (error) {
      console.log(error);
      return 'Cannot create user';
    }
  }
}

export default new UserService();
