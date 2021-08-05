import { NextFunction } from 'express'
import { createMethodDecorator, UnauthorizedError } from 'type-graphql'
export default () => {
  return createMethodDecorator(async ({context}: any, next: NextFunction)=>{
    return context.isAuth ? next() : new UnauthorizedError
  })
}
