import { NextFunction } from "express";
import { createMethodDecorator, UnauthorizedError } from "type-graphql";
export default () => {
  return createMethodDecorator(async ({ context }: any, next: NextFunction) => {
    // Gonna stick to using type-graphql built-in error handling
    return context.isAuth ? next() : new UnauthorizedError();
  });
};
