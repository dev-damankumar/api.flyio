import express from "express";
import http from "http";
import mongoose from "mongoose";
import cors from "cors";
import {
  expressMiddleware,
  ExpressContextFunctionArgument,
} from "@apollo/server/express4";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/typedefs";
import { _dev_, db, port } from "./constants";
import { decodeJWT, getTokenFromHeaders } from "./utils/auth";

async function main() {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: _dev_,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();
  app.use(express.json());

  app.use(
    "/graphql",
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }: ExpressContextFunctionArgument) => {
        const token = getTokenFromHeaders(req);
        let auth = null;
        if (token) {
          auth = await decodeJWT(token);
        }
        return {
          req,
          res,
          auth,
        };
      },
    })
  );
  await mongoose.connect(db);
  httpServer.listen(port, () => {
    console.log("Server Started on port:", port);
  });
}

main();
