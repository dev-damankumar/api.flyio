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
exports.addZoomMeeting = void 0;
const join_meeting_1 = __importDefault(require("../../templates/join-meeting"));
const user_1 = __importDefault(require("../../models/user"));
const constants_1 = require("../../constants");
const meeting_1 = __importDefault(require("../../models/meeting"));
const __1 = require("..");
const axios_1 = __importDefault(require("axios"));
const email_1 = require("../email");
function addZoomMeeting(context, details) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        if (!context.auth)
            throw new Error('Unauthorized access');
        const userId = context.auth._id;
        const user = yield user_1.default.findOne({
            _id: userId,
        });
        if (!user)
            throw new Error('Unauthorized access');
        const accessToken = (_b = (_a = user.integration) === null || _a === void 0 ? void 0 : _a.zoom) === null || _b === void 0 ? void 0 : _b.accessToken;
        if (!accessToken)
            throw new __1.GQLError('Missing access token', constants_1.GQLErrorCodes.NO_ACCESS_TOKEN);
        const attendees = details.users.map((user) => ({ email: user === null || user === void 0 ? void 0 : user.email }));
        const event = {
            topic: details.name,
            type: 2,
            start_time: details.startDate,
            duration: 30,
            timezone: details.location || 'Asia/Calcutta',
            settings: {
                approval_type: 2,
                join_before_host: true,
                meeting_authentication: true,
            },
            agenda: details.description,
            invitees: attendees,
        };
        try {
            const data = yield axios_1.default.post('https://api.zoom.us/v2/users/me/meetings', event, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const meeting = yield meeting_1.default.create(Object.assign({}, details));
            yield (0, email_1.send)({
                to: user.email,
                subject: 'Zoom Meeting Invite From Fly IO',
                html: (0, join_meeting_1.default)('User', details.description || '', data.data.join_url),
                cc: attendees.join(),
            });
            return meeting;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    });
}
exports.addZoomMeeting = addZoomMeeting;
