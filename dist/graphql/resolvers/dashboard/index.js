"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardQueries = exports.dashboardMutations = void 0;
var mutation_1 = require("./mutation");
Object.defineProperty(exports, "dashboardMutations", { enumerable: true, get: function () { return __importDefault(mutation_1).default; } });
var query_1 = require("./query");
Object.defineProperty(exports, "dashboardQueries", { enumerable: true, get: function () { return __importDefault(query_1).default; } });
