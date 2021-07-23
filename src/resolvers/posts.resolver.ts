import "reflect-metadata";
import { Post, CreatePostInput } from "../models/posts.model";
import { Resolver, Mutation, Arg } from "type-graphql";
import postService from "../services/posts.service";
// import { User } from "../models/users.model";
// import userService from "../services/users.service";

@Resolver(Post)
export class PostResolver {
  @Mutation((_) => Boolean, { nullable: true })
  async createPost(@Arg("data") data: CreatePostInput) {
    return await postService.create(data);
  }
}
