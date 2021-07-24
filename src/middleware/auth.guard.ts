import { JwtAuthToken } from "declarations/jwt";
import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'

export default function(req: Request,_:Response,next:NextFunction){
  const authHeader = req.get('Authorization')
  if (!authHeader) {
    req.isAuth = false
    return next();
  }
  const token = authHeader.split(' ')[1];
  if(!token || token === ''){
    req.isAuth = false;
    return next()
  }
  const decToken = jwt.verify(token, 'secret') as JwtAuthToken
  if (decToken) {
    req.isAuth = true;
    req.userId = decToken.userId
    return next()
  } else {
    req.isAuth = false;
    return next()
  }

}
