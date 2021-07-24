import "reflect-metadata";
import { User } from "../models/users.model";
import {
  Resolver,
  Query,
  Arg,
  FieldResolver,
  Root,
  Ctx,
} from "type-graphql";
import userService from "../services/users.service";
import postService from "../services/posts.service";
import AuthGuard from '../decorators/auth.dec'

@Resolver(User)
export class UserResolver {
  @AuthGuard()
  @Query((_) => User, { nullable: true })
  async user(@Arg("id") id: number) {
    return await userService.findById(id);
  }

  @FieldResolver()
  async posts(@Root() user: User, @Ctx() ctx:any) {
    console.log(ctx.isAuth)
    let payload = await postService.postsByUserId(user.id);
    // Can I limit this field resolver to only be used with certain
    // Queries?
    // Circular Calls w/ posts/author? maybe
    payload.forEach((post) => (post.author = user));
    return payload;
  }

}
