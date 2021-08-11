import "reflect-metadata";
import { Post, CreatePostInput } from "../models";
import { Resolver, Mutation, Arg } from "type-graphql";
import { postService } from "../services";
import AuthGuard from '../decorators/authDec'

@Resolver(Post)
export class PostResolver {
  @AuthGuard()
  @Mutation((_) => Boolean, { nullable: true })
  async createPost(@Arg("data") data: CreatePostInput) {
    return await postService.create(data);
  }
}
