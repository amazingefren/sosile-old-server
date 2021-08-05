import "reflect-metadata";
import { User, UserAuthInput, CreateUserInput } from "../models/users.model";
import { Resolver, Query, Arg, Mutation, Ctx } from "type-graphql";
import userService from "../services/users.service";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import { Response } from "express";
// import { Response } from "express";

const SALTROUNDS = 10;

/* @ObjectType()
class AuthData {
  @Field(_=>Number)
  id: number

  @Field(_=>String)
  token: string

  @Field(_=>String)
  refresh_token: string

  @Field(_=>String)
  tokenExpiration: string
} */

export const SignToken = async (user: User): Promise<{new_token: string, new_refresh: string}> => {
  const token_payload = {userId: user.id, username: user.username, email: user.email}

  // TODO: SECRETS
  const token = jwt.sign(token_payload, 'secret', {expiresIn: '5s'})
  const refresh_token = jwt.sign(token_payload, 'refreshsecret', {expiresIn: '30d'})

  return {new_token: token, new_refresh: refresh_token}
}

@Resolver()
export class AuthResolver {
  @Query((_) => Boolean, { nullable: true })
  async login(@Arg("data") { username, password }: UserAuthInput, @Ctx() {res}: {res:Response}) {
    try{
      const user = await userService.findByUsername(username);
      const match = await bcrypt.compare(password, user.password)
      !match && console.log("pass fail")
      const {new_token, new_refresh} = await SignToken(user)
      res.cookie("token", new_token)
      res.cookie("refresh_token", new_refresh)
      return user && match ? true : false
    } catch (_) {
      console.log('user not found')
      return false
    }
    // in dev, password failure will be mentioned
    /* if (match){
      // return await SignToken(user)
    } else {
      return false
      // return new Error("Password Doesn't Match")
    } */
  }

  @Mutation((_) => Boolean, { nullable: true })
  async register(@Arg("data") data: CreateUserInput) {
    const hashed = await bcrypt.hash(data.password, SALTROUNDS).catch((err) => {
      throw err;
    });
    data.password = hashed;
    return await userService.create(data);
  }
}
