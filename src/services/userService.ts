import { RegisterInput } from "../models";
import { prisma } from "./prismaService";

const userService = {
  async findByUsername(username: string): Promise<any | null> {
    console.log('finding by username')
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return null
    } else {
      return user;
    }
  },

  async findById(id: number): Promise<any | null> {
    console.log('finding by id')
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      if(user){
        return user;
      } else {
        return null;
      }
    } catch {
      return null;
    }
  },

  async create(data: RegisterInput): Promise<boolean> {
    try {
      const completed = await prisma.user.create({ data });
      if (completed) {
        console.log(completed);
      }
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
};

export { userService };
