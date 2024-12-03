import { ApolloServer } from "@apollo/server";

import cors from "cors";
import express from "express";
import { authMiddleware, handleLogin } from "./auth.js";

const PORT = 9000;

const apolloServer = new ApolloServer({});
const app = express();
app.use(cors(), express.json(), authMiddleware);

app.post("/login", handleLogin);

await apolloServer.start();

app.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`);
});
