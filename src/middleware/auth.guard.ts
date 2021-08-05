import { JwtAuthToken } from "../declarations/jwt";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import userService from "../services/users.service";
import { Request } from "express";

export default async function (req: Request, _: Response, next: NextFunction) {
  // const token = req.get("token");
  // const refresh_token = req.get("refresh_token");
  const token = req.cookies.token;
  const refresh_token = req.cookies.refresh_token;
  
  // TODO: Switch to cookie
  //

  // Check Tokens Exist
  /* if (!token || token === "" || !refresh_token || refresh_token === "") {
    req.isAuth = false;
    return next();
  } */

  // Verify short token
  try {
    // TODO: SECRET
    if(token){
      let tokenData = jwt.verify(token, "secret", {ignoreExpiration: true}) as JwtAuthToken;
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

  /* console.log("")
  console.log("-=--------------------------")
  console.log(refresh_data)
  console.log("-=--------------------------")
  console.log("") */

  if (refresh_data.userId){
    try{
      const user = await userService.findById(refresh_data.userId)
      req.userId = user.id
      // console.log(user)
    } catch (e) {
      console.log(e)
    }
  }


  return next()
}
