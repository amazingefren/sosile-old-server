import express, { Response } from "express";
import winston from "winston";
import expressWinston from "express-winston";
import prisma from './services/prisma.service'
import { graphqlHTTP } from "express-graphql";
import { UserResolver } from "./resolvers/users.resolver";
import { buildSchema } from "type-graphql";
require("dotenv").config();

const app = express(),
  PORT = process.env.PORT || 3000;

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
  await prisma.$connect().then(()=>{
    console.log("connected to db")
  })

  app.get("/", async (_, res: Response) => {
    return res.send("Hello World");
  });

  const schema = await buildSchema({resolvers: [UserResolver]})

  app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
  })),

  app.listen(PORT, () => {
    console.log("server started on port: " + PORT);
  });
}

startServer().catch(e=>{throw e}).finally(async ()=>{
  await prisma.$disconnect()
});
