import { JwtAuthToken, JwtRefreshToken } from "../declarations/jwt";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import userService from "../services/users.service";
import { Request } from "express";
import { SignToken } from "../resolvers/auth.resolver";

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
      let tokenData = jwt.verify(token, "secret") as JwtAuthToken;
      req.userId = tokenData.userId;
      req.isAuth = true;
      return next();
    }
  } catch (_: any) {
    // READ: NOTE
  }

  let refresh_data;
  try {
    refresh_data = jwt.verify(
      refresh_token,
      "refreshsecret"
    ) as JwtRefreshToken;
    req.isAuth = true;
  } catch (e: any) {
    req.isAuth = false;
    console.log(e);
    return next();
  }

  if (!refresh_data.userId) {
    console.log("refresh_data: EMPTY?");
    req.isAuth=false
    return next();
  } else {
    const user = await userService.findById(refresh_data.userId);
    req.userId = user.id;
    const { new_token } = await SignToken(user);
    res.cookie("token", new_token);
  }

  return next();
}
