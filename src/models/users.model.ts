import "reflect-metadata";
import { Field, InputType, ObjectType } from "type-graphql";
import { Post } from "./posts.model";

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

@InputType()
export class UserUniqueInput{
  @Field({nullable: false})
  id: number

  @Field()
  username?: string
}

@InputType()
export class LoginInput{
  @Field(_=>String,{nullable: false})
  username: string;

  @Field(_=>String,{nullable: false})
  password: string;
}

@InputType()
export class RegisterInput {
  @Field()
  username: string;
  @Field()
  email: string;
  @Field()
  password: string;
}
