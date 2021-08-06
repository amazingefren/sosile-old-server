import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authGuard from "./middleware/authGuard";
import { buildSchema } from "type-graphql";
import { graphqlHTTP } from "express-graphql";
import { prisma } from "./services";
import { UserResolver, PostResolver, AuthResolver } from "./resolvers";

require("dotenv").config();

async function startServer() {
  // Initialize App
  const app = express(),
    PORT = process.env.PORT || 3000;

  // Initialize Database
  await prisma.$connect().then(() => {
    console.log("connected to db");
  });

  // Apply Middleware
  // Cors
  app.use(cors({ origin: "http://localhost:4000", credentials: true }));
  // Cookie Parser
  app.use(cookieParser());
  // Auth Guard
  app.use(authGuard);
  // GraphQL
  const schema = await buildSchema({
    resolvers: [AuthResolver, UserResolver, PostResolver],
  });
  app.use(
    "/graphql",
    graphqlHTTP({
      schema,
      graphiql: false,
    })
  ),
    // Start Server
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
