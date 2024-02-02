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
const user_controller_1 = __importDefault(require("../../../controller/user.controller"));
const userQueries = {
    users: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield user_controller_1.default.getUsers();
    }),
    me: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("ok", context);
        return yield user_controller_1.default.me(context);
    }),
    user: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
        return yield user_controller_1.default.getUser(args.id);
    }),
    login: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
        return yield user_controller_1.default.loginUser(args.email, args.password);
    }),
};
exports.default = userQueries;
