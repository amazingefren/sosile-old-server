import { JwtAuthToken } from "../declarations/jwt";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import userService from "../services/users.service";
import { Request } from "express";
import { SignToken } from "../resolvers/auth.resolver";

export default async function (req: Request, res: Response, next: NextFunction) {
  // const token = req.get("token");
  // const refresh_token = req.get("refresh_token");
  const token = req.cookies.token;
  const refresh_token = req.cookies.refresh_token;
  
  // TODO: Switch to cookie
  //

  // Check Tokens Exist
  if (!token || token === "" || !refresh_token || refresh_token === "") {
    req.isAuth = false;
    return next();
  }

  // Verify short token
  try {
    // TODO: SECRET
    if(token){
      let tokenData = jwt.verify(token, "secret") as JwtAuthToken;
      req.userId = tokenData.userId;
      req.isAuth = true;
      return next();
    }
  } catch (e: any) {
    // req.isAuth = false;
    console.log(e);
    // return next();
  }

  let refresh_data;

  try {
    // TODO: SECRET
    refresh_data = jwt.verify(refresh_token, "refreshsecret") as JwtAuthToken;
    req.isAuth = true;
  } catch (e: any) {
    req.isAuth = false;
    console.log(e);
    return next();
  }

  if(!refresh_data.userId){
    console.log("refresh_data: EMPTY?")
    next();
  } else {
    const user = await userService.findById(refresh_data.userId)
    req.userId=user.id
    const {new_token} = await SignToken(user)
    // TODO: prevent refresh_token abuse
    res.cookie("token", new_token)
    // res.cookie("refresh_token", new_refresh)
  }


  /* if (refresh_data.userId){
    try{
      req.userId = user.id
      // console.log(user)
    } catch (e) {
      console.log(e)
    }
  } */

  return next()
}
