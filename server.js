import { ApolloServer } from "@apollo/server";
import { expressMiddleware as apolloMiddleware } from "@apollo/server/express4";

import cors from "cors";
import express from "express";
import { authMiddleware, handleLogin } from "./auth.js";

import fs from "node:fs/promises";
import { resolvers } from "./resolvers.js";
import { getUser } from "./db/users.js";
import { createCompanyLoaderInstance } from "./db/companies.js";

const PORT = 9000;

const typeDefs = await fs.readFile("./schema.graphql", "utf-8");

const apolloServer = new ApolloServer({ typeDefs, resolvers });
await apolloServer.start();
const app = express();

app.use(cors(), express.json(), authMiddleware);

app.post("/login", handleLogin);
app.use(
  "/graphql",
  apolloMiddleware(apolloServer, {
    context: getContext,
  })
);

async function getContext({ req }) {
  const companyLoader = createCompanyLoaderInstance();
  const context = { companyLoader };
  if (req.auth) {
    context.user = await getUser(req.auth.sub);
  }
  return context;
}

app.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
});
