import "reflect-metadata";
import { User, UserAuthInput, CreateUserInput } from "../models/users.model";
import { Resolver, Query, Arg, Mutation, ObjectType, Field } from "type-graphql";
import userService from "../services/users.service";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'

const SALTROUNDS = 10;

@ObjectType()
class AuthData {
  @Field(_=>Number)
  id: number

  @Field(_=>String)
  token: string

  @Field(_=>String)
  refresh_token: string

  @Field(_=>String)
  tokenExpiration: string
}

const SignToken = async (user: User): Promise<AuthData> => {
  const token_payload = {userId: user.id, username: user.username, email: user.email}

  // TODO: SECRETS
  const token = jwt.sign(token_payload, 'secret', {expiresIn: '5m'})
  const refresh_token = jwt.sign(token_payload, 'refreshsecret', {expiresIn: '30d'})

  return {id: user.id, token, refresh_token, tokenExpiration: '5m'}
}

@Resolver()
export class AuthResolver {
  @Query((_) => AuthData, { nullable: true })
  async login(@Arg("data") { username, password }: UserAuthInput) {
    const user = await userService.findByUsername(username);
    const match = await bcrypt.compare(password, user.password)
    // in dev, password failure will be mentioned
    if (match){
      return await SignToken(user)
    } else {
      return new Error("Password Doesn't Match")
    }
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
