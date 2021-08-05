import express, { Response } from "express";
import winston from "winston";
import expressWinston from "express-winston";
import prisma from "./services/prisma.service";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/users.resolver";
// import session from 'express-session'
import { PostResolver } from "./resolvers/posts.resolver";
import { AuthResolver } from "./resolvers/auth.resolver";
import authGuard from "./middleware/auth.guard";
import cookieParser from 'cookie-parser';

require("dotenv").config();

const app = express(),
  PORT = process.env.PORT || 3000;
app.use(cookieParser())



if (process.env.NODE_ENV == "development") {
  app.use(
    expressWinston.logger({
      transports: [new winston.transports.Console()],
      format: winston.format.cli(),
      meta: false,
      expressFormat: true,
      colorize: true,
    })
  );
}

async function startServer() {
  await prisma.$connect().then(() => {
    console.log("connected to db");
  });

  /* app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000*30
    }
  })) */


  app.use(authGuard);

  app.get("/", async (req: any, res: Response) => {
    console.log(req.session);
    return res.send("Hello World");
  });

  const schema = await buildSchema({
    resolvers: [AuthResolver, UserResolver, PostResolver],
  });

  app.use(
    "/graphql",
    graphqlHTTP({
      schema,
      graphiql: true,
    })
  ),
    app.listen(PORT, () => {
      console.log("server started on port: " + PORT);
    });
}

startServer()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
