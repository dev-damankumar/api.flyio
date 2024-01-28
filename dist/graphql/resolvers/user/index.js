"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userQueries = exports.userMutations = void 0;
var mutations_1 = require("./mutations");
Object.defineProperty(exports, "userMutations", { enumerable: true, get: function () { return __importDefault(mutations_1).default; } });
var queries_1 = require("./queries");
Object.defineProperty(exports, "userQueries", { enumerable: true, get: function () { return __importDefault(queries_1).default; } });
