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
const userMutations = {
    createUser: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
        return yield user_controller_1.default.createNewUser(args);
    }),
    updateUser: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        return yield user_controller_1.default.updateAnUser(args, context);
    }),
    forgotPassword: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
        return yield user_controller_1.default.forgotPassword(args);
    }),
    resetPassword: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        return yield user_controller_1.default.resetPassword(context, args);
    }),
    authorizeIntegrationCalender: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        return yield user_controller_1.default.authorizeIntegrationCalender(context, args);
    }),
};
exports.default = userMutations;
