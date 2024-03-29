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
exports.cancelFlyIOMeeting = exports.addFlyIOMeeting = void 0;
const meeting_1 = __importDefault(require("../../models/meeting"));
const shortid_1 = __importDefault(require("shortid"));
const path_1 = __importDefault(require("path"));
const email_1 = require("../email");
const join_meeting_1 = __importDefault(require("../../templates/join-meeting"));
const cancelMeeting_1 = __importDefault(require("../../templates/cancelMeeting"));
const constants_1 = require("../../constants");
const user_1 = __importDefault(require("../../models/user"));
const axios_1 = require("axios");
const __1 = require("..");
function addFlyIOMeeting(context, details) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const event = details;
            const meetingId = shortid_1.default.generate();
            event.meetingId = meetingId;
            event.url = path_1.default.join('/', 'flyio', meetingId);
            const attendees = details.users.map((user) => (user === null || user === void 0 ? void 0 : user.email) || '');
            const user = yield user_1.default.findOne({ _id: details.host });
            if (!user)
                throw new Error('no user found.');
            const meet = yield meeting_1.default.create(event);
            yield (0, email_1.send)({
                to: user.email,
                subject: 'Fly io Meeting Invite',
                html: (0, join_meeting_1.default)('User', details.description || '', `${constants_1.siteurl}/${event.url}`),
                cc: attendees.join(),
            });
            return meet;
        }
        catch (error) {
            console.log('There was an error contacting the Calendar service: ' + error);
            throw new Error('There was an error while creating event');
        }
    });
}
exports.addFlyIOMeeting = addFlyIOMeeting;
function cancelFlyIOMeeting(context, meetingId) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (!context.auth)
            throw new Error('Unauthorized access');
        const userId = context.auth._id;
        const user = yield user_1.default.findOne({
            _id: userId,
        });
        if (!user)
            throw new Error('Unauthorized access');
        try {
            const meeting = yield meeting_1.default.findOneAndDelete({
                host: user._id,
                meetingId,
            });
            if (!meeting)
                throw new __1.GQLError('Meeing does not exists.', constants_1.GQLErrorCodes.MEETING_DOES_NOT_EXIST);
            const attendees = meeting.users.map((user) => (user === null || user === void 0 ? void 0 : user.email) || '');
            yield (0, email_1.send)({
                to: user.email,
                subject: 'Fly io Meeting Cancelled',
                html: (0, cancelMeeting_1.default)('Flyio User', `${constants_1.siteurl}/dashboard`, meeting === null || meeting === void 0 ? void 0 : meeting.name),
                cc: attendees.join(),
            });
            return {
                message: 'We have cancel your meeting',
                status: 200,
                type: 'success',
            };
        }
        catch (error) {
            if (error instanceof axios_1.AxiosError) {
                if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.data.code) === 3001) {
                    throw new __1.GQLError('Meeing does not exists.', constants_1.GQLErrorCodes.MEETING_DOES_NOT_EXIST);
                }
                throw error;
            }
            throw error;
        }
    });
}
exports.cancelFlyIOMeeting = cancelFlyIOMeeting;
