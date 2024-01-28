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
exports.sendError = exports.decodeJWT = exports.getTokenFromHeaders = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../constants");
const getTokenFromHeaders = (req) => {
    var _a;
    const authorization = req.headers.authorization || "";
    return (_a = authorization === null || authorization === void 0 ? void 0 : authorization.split(" ")[1]) === null || _a === void 0 ? void 0 : _a.trim();
};
exports.getTokenFromHeaders = getTokenFromHeaders;
const decodeJWT = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return (yield jsonwebtoken_1.default.verify(token, constants_1.jwtSecret));
    }
    catch (error) {
        if (error instanceof Error)
            console.log("Error decoding Jwt", error.message);
        return null;
    }
});
exports.decodeJWT = decodeJWT;
const sendError = (message = "Unhandled Error has occured!!!", status = 500) => {
    return {
        message,
        status,
    };
};
exports.sendError = sendError;
