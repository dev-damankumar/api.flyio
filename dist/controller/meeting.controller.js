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
        throw new Error('Unauthorized access');
    const match = { host: context.auth._id };
    console.log('data', data);
    const { todayEndDate, todayNowDate, todayStartDate } = (0, date_1.getTodayDateRange)();
    const { tomorrowEndDate, tomorrowStartDate } = (0, date_1.gettomorrowDateRange)();
    if (data === null || data === void 0 ? void 0 : data.today) {
        match.startDate = { $gte: todayNowDate, $lt: todayEndDate };
    }
    else if (data === null || data === void 0 ? void 0 : data.tomorrow) {
        match.startDate = { $gte: tomorrowStartDate, $lt: tomorrowEndDate };
    }
    else if (data === null || data === void 0 ? void 0 : data.someday) {
        match.startDate = { $gt: tomorrowEndDate };
    }
    else {
        match.startDate = { $lt: todayNowDate };
        console.log('here', data);
    }
    const meetings = yield meeting_1.default.find(match).sort('startDate').exec();
    return meetings;
});
const addMeetingHandler = (context, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!context.auth)
        throw new Error('Unauthorized access');
    const host = context.auth._id;
    return yield (0, index_1.addMeeting)(context, data.type, Object.assign(Object.assign({}, data), { host }));
});
const cancelMeetingHandler = (context, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!context.auth)
        throw new Error('Unauthorized access');
    const host = context.auth._id;
    return yield (0, index_1.cancelMeeting)(context, data.type, data.meetingId);
});
const checkIfUserisInvited = (context, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!context.auth)
        throw new Error('Unauthorized access');
    const userId = context.auth._id;
    const meetingId = data.meetingId;
    const user = yield meeting_1.default.findOne({
        meetingId,
        $or: [{ host: userId }, { 'users._id': userId }],
    });
    return { verified: !!user };
});
exports.default = {
    getMeetingsHandler,
    addMeetingHandler,
    checkIfUserisInvited,
    cancelMeetingHandler,
};
