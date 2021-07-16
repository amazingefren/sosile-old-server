import "reflect-metadata"
import { CreateUserInput, User } from "../models/users.model";
import { Mutation, Resolver, Query, Arg } from "type-graphql";
import userService from '../services/users.service'

@Resolver(User)
export class UserResolver {
  @Query(_=>User, {nullable: true})
  async user(@Arg("id") id: number){
    return await userService.findById(id)
  }

  @Mutation(_=>Boolean, {nullable: true})
  async create(
    @Arg("data") data: CreateUserInput
    ){
    return await userService.create(data)
  }
}


