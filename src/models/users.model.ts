import "reflect-metadata";
import { Field, InputType, ObjectType } from "type-graphql";

@ObjectType()
export class User {
  @Field((_) => Number)
  id: number;

  @Field((_) => String)
  email: string;

  @Field((_) => String)
  username: string;

  @Field((_) => [Post], {nullable: true})
  posts: Post[] | null[];

  @Field()
  joinDate: Date;
}

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

  @Field(_=>User)
  author: User;
}

@InputType()
export class UserUniqueInput{
  @Field({nullable: false})
  id: number

  @Field()
  username?: string
}

@InputType()
export class CreateUserInput {
  @Field()
  username: string;
  @Field()
  email: string;
  @Field()
  password: string;
}
