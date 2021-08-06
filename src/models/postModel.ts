import "reflect-metadata";
import { Field, InputType, ObjectType } from "type-graphql";
import { User } from "./userModel";

@ObjectType()
export class Post {
  @Field((_) => Number)
  id: number;

  @Field((_) => String)
  content: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field((_) => User, { nullable: true })
  author?: User;
}

@InputType()
export class CreatePostInput {
  @Field({ nullable: false })
  content: string;

  @Field({ nullable: false })
  authorId: number;
}
