import { ApolloServer } from "@apollo/server";
import { expressMiddleware as apolloMiddleware } from "@apollo/server/express4";

import cors from "cors";
import express from "express";
import { authMiddleware, handleLogin } from "./auth.js";

import fs from "node:fs/promises";
import { resolvers } from "./resolvers.js";

const PORT = 9000;

const typeDefs = await fs.readFile("./schema.graphql", "utf-8");

const apolloServer = new ApolloServer({ typeDefs, resolvers });
await apolloServer.start();
const app = express();

app.use(cors(), express.json(), authMiddleware);

app.post("/login", handleLogin);
app.use("/graphql", apolloMiddleware(apolloServer));

app.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
});
