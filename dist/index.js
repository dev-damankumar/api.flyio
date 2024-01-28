"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const express4_1 = require("@apollo/server/express4");
const server_1 = require("@apollo/server");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const resolvers_1 = __importDefault(require("./graphql/resolvers"));
const typedefs_1 = __importDefault(require("./graphql/typedefs"));
const constants_1 = require("./constants");
const auth_1 = require("./utils/auth");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        const httpServer = http_1.default.createServer(app);
        const server = new server_1.ApolloServer({
            typeDefs: typedefs_1.default,
            resolvers: resolvers_1.default,
            introspection: constants_1._dev_,
            plugins: [(0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer })],
        });
        yield server.start();
        app.use(express_1.default.json());
        app.use("/graphql", (0, cors_1.default)(), express_1.default.json(), (0, express4_1.expressMiddleware)(server, {
            context: ({ req, res }) => __awaiter(this, void 0, void 0, function* () {
                const token = (0, auth_1.getTokenFromHeaders)(req);
                let auth = null;
                if (token) {
                    auth = yield (0, auth_1.decodeJWT)(token);
                }
                return {
                    req,
                    res,
                    auth,
                };
            }),
        }));
        yield mongoose_1.default.connect(constants_1.db);
        httpServer.listen(constants_1.port, () => {
            console.log("Server Started on port:", constants_1.port);
        });
    });
}
main();
