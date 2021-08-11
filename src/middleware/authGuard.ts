// import { JwtAuthToken, JwtRefreshToken } from "../declarations/jwt";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { userService } from "../services";
import { Request } from "express";
import { SignToken } from "../resolvers";
import { JwtAuthToken, JwtRefreshToken } from "@types";
import { UnauthorizedError } from "type-graphql";
import Config from "../config";

/*
 * RT = refresh_token
 * AT = access_token
 *
 * Database Store Session (RT)
 *   - This can be used to invalidate RT
 *
 * User should not send RT until AT is invalidated
 *   - Request RT only when, AT is invalid
 *   - RT Rotations*
 *
 * GOAL: Provide User with Session Security Options
 *       Prevent Refresh Token Abuse
 *       Key Rotation / Server Security
 *
 * TODO: SECRET_KEYS
 */

export default async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies.token;
  const refresh_token = req.cookies.refresh_token;

  try {
    if (token) {
      let tokenData = jwt.verify(token, Config.AT_SECRET) as JwtAuthToken;
      req.userId = tokenData.userId;
      req.isAuth = true;
      return next();
    }
  } catch (_: any) {
    // READ: NOTE
  }

  let refresh_data;
  try {
    if (refresh_token) {
      refresh_data = jwt.verify(
        refresh_token,
        Config.RT_SECRET
      ) as JwtRefreshToken;
    }
  } catch (e: any) {
    req.isAuth = false;
    return next();
  }

  // Error handling logic between AuthGuard && UserService
  // IF user is not found in userservice, userservice should not return UnauthorizedError
  // Instead return (new type of NOT_FOUND error TODO:)
  // That way, this middleware can properly handle the response of UnauthorizedError
  // CASE: user1 is friends with user2
  // user2 deletes account
  // user1 should not be sent an UnauthorizedError from the userservice
  // instead a simple NOT_FOUND error can be sent
  //
  // SO: No UnauthorizedError anywhere besides here and the Authentication Decorator

  if (!refresh_data) {
    // console.log("refresh_data: EMPTY?");
    req.isAuth = false;
    return next();
  } else {
    try {
      const user = await userService.findById(refresh_data.userId);
      if (user.id) {
        console.log(user);
        req.userId = user.id;
        const { new_token } = await SignToken(user);
        res.cookie("token", new_token);
        req.isAuth = true;
        return next();
      } else {
        req.isAuth = false;
        new UnauthorizedError();
      }
    } catch {
      req.isAuth = false;
      new UnauthorizedError();
    }
  }

  return next();
}
