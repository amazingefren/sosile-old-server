import "reflect-metadata";
import { User, LoginInput, RegisterInput } from "../models";
import { Resolver, Arg, Mutation, Ctx, Query } from "type-graphql";
import { userService } from "../services";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Response } from "express";
import AuthGuard from '../decorators/authDec'
import Config from '../config'

export const SignToken = async (
  user: User
): Promise<{ new_token: string; new_refresh: string }> => {
  const token_payload = {
    userId: user.id,
    username: user.username,
    email: user.email,
  };

  // TODO: SECRETS
  const token = jwt.sign(token_payload, Config.AT_SECRET, { expiresIn: "5s" });
  const refresh_token = jwt.sign(token_payload, Config.RT_SECRET, {
    expiresIn: "30d",
  });

  return { new_token: token, new_refresh: refresh_token };
};

@Resolver()
export class AuthResolver {
  // Login Resolver
  @Mutation((_) => Boolean, { nullable: true })
  async login(
    @Arg("data") { username, password }: LoginInput,
    @Ctx() { res }: { res: Response }
  ) {
    try {
      const user = await userService.findByUsername(username);
      const match = await bcrypt.compare(password, user.password);
      !match && console.log("pass fail");
      if(match){
        const { new_token, new_refresh } = await SignToken(user);
        res.cookie("token", new_token);
        res.cookie("refresh_token", new_refresh);
      }
      return user && match
    } catch (_) {
      console.log("user not found");
      return false;
    }
  }

  // Register Resolver
  @Mutation((_) => Boolean, { nullable: true })
  async register(@Arg("data") data: RegisterInput) {

    const salt = await bcrypt.genSalt(Config.SALTROUNDS)
    const hashed = await bcrypt.hash(data.password, salt).catch((err) => {
      throw err;
    });
    data.password = hashed;
    return await userService.create(data);
  }

  @AuthGuard()
  @Query((_)=>Boolean)
  async isAuth(){
    return true
  }
}
