import { JwtAuthToken } from "../declarations/jwt";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import userService from "../services/users.service";

export default async function (req: Request, _: Response, next: NextFunction) {
  const token = req.get("token");
  const refresh_token = req.get("refresh_token");
  
  // TODO: Switch to cookie

  // Check Tokens Exist
  if (!token || token === "" || !refresh_token || refresh_token === "") {
    req.isAuth = false;
    return next();
  }

  // Verify short token
  try {
    // TODO: SECRET
    let tokenData = jwt.verify(token, "secret") as JwtAuthToken;
    req.userId = tokenData.userId;
    req.isAuth = true;
    next();
  } catch (e: any) {
    req.isAuth = false;
    console.log(e);
    // return next();
  }

  let refresh_data;

  try {
    // TODO: SECRET
    refresh_data = jwt.verify(refresh_token, "refreshsecret") as JwtAuthToken;
  } catch (e: any) {
    req.isAuth = false;
    console.log(e);
    return next();
  }

  if (refresh_data?.userId){
    try{
      const user = await userService.findById(refresh_data.userId)
      console.log(user)
    } catch (e) {
      console.log(e)
    }
  }

  return next()
}
