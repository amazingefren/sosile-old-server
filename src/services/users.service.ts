import { CreateUserInput } from "../models/users.model";
import prisma from "./prisma.service";

const userService = {
  async findById(id: number): Promise<any | null>{
    const user = await prisma.user.findUnique({where: {id}})
    if (user){
      return user
    } 
    return null
  },
  async create(data:CreateUserInput): Promise<boolean> {
    try{
      const completed = await prisma.user.create({data})
      if (completed){
        console.log(completed)
      }
      return true
    } catch (e){
      console.log(e)
      return false
    }
  },
};
export default userService;
