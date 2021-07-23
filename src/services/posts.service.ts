import { CreatePostInput, Post } from "../models/posts.model";
import prisma from "./prisma.service";

const postService = {
  async create(data: CreatePostInput): Promise<boolean> {
    try {
      const post = await prisma.post.create({ data });
      if (post) {
        console.log(post);
        return true;
      }
      return false;
    } catch (e) {
      console.log(e);
      return false;
    }
  },

  async postsByUserId(userId: number): Promise<Post[]> {
    const posts = await prisma.post.findMany({ where: { authorId: userId } });
    return posts;
  },
};

export default postService;
