import "reflect-metadata";
import { CreateUserInput, User } from "../models/users.model";
import {
  Mutation,
  Resolver,
  Query,
  Arg,
  FieldResolver,
  Root,
} from "type-graphql";
import userService from "../services/users.service";
import postService from "../services/posts.service";
// import { Post } from "../models/posts.model";

@Resolver(User)
export class UserResolver {
  @Query((_) => User, { nullable: true })
  async user(@Arg("id") id: number) {
    return await userService.findById(id);
  }

  @Mutation((_) => Boolean, { nullable: true })
  async createUser(@Arg("data") data: CreateUserInput) {
    return await userService.create(data);
  }

  @FieldResolver()
  async posts(@Root() user: User) {
    let payload = await postService.postsByUserId(user.id);
    // Can I limit this field resolver to only be used with certain
    // Queries?
    // Circular Calls w/ posts/author? maybe
    payload.forEach((post) => (post.author = user));
    return payload;
  }
}
