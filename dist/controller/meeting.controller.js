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
const meeting_1 = __importDefault(require("../models/meeting"));
const date_1 = require("../utils/date");
const index_1 = require("../utils/meeting/index");
const getMeetingsHandler = (context, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!context.auth)
        throw new Error("Unauthorized access");
    const match = { host: context.auth._id };
    if (data === null || data === void 0 ? void 0 : data.today) {
        const { todayEndDate, todayStartDate } = (0, date_1.getTodayDateRange)();
        match.startDate = { $gte: todayStartDate, $lt: todayEndDate };
    }
    if (data === null || data === void 0 ? void 0 : data.tommorrow) {
        const { tommorrowEndDate, tommorrowStartDate } = (0, date_1.getTommorrowDateRange)();
        match.startDate = { $gte: tommorrowStartDate, $lt: tommorrowEndDate };
    }
    console.log("match", match);
    const meetings = yield meeting_1.default.find(match).sort("startDate").exec();
    return meetings;
});
const addMeetingHandler = (context, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!context.auth)
        throw new Error("Unauthorized access");
    const host = context.auth._id;
    const event = yield (0, index_1.addMeeting)(data.type, data);
    const meeting = yield meeting_1.default.create(Object.assign(Object.assign({}, data), { host }));
    return meeting;
});
exports.default = {
    getMeetingsHandler,
    addMeetingHandler,
};
