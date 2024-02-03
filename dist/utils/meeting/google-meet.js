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
exports.cancelGoogleMeeting = exports.addGoogleMeeting = void 0;
const user_1 = __importDefault(require("../../models/user"));
const googleapis_1 = require("googleapis");
const uuid_1 = require("uuid");
const constants_1 = require("../../constants");
const meeting_1 = __importDefault(require("../../models/meeting"));
const index_1 = require("../index");
const email_1 = require("../email");
const cancelMeeting_1 = __importDefault(require("../../templates/cancelMeeting"));
const oAuth2Client = new googleapis_1.google.auth.OAuth2(constants_1.googleClientId, constants_1.googleSecretId);
const calendar = googleapis_1.google.calendar({
    version: 'v3',
    auth: oAuth2Client,
});
function addGoogleMeeting(context, details) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        if (!context.auth)
            throw new Error('Unauthorized access');
        const userId = context.auth._id;
        const user = yield user_1.default.findOne({
            _id: userId,
        });
        if (!user)
            throw new Error('Unauthorized access');
        const accessToken = (_b = (_a = user.integration) === null || _a === void 0 ? void 0 : _a.google) === null || _b === void 0 ? void 0 : _b.accessToken;
        const refreshToken = (_d = (_c = user.integration) === null || _c === void 0 ? void 0 : _c.google) === null || _d === void 0 ? void 0 : _d.refreshToken;
        if (!accessToken)
            throw new index_1.GQLError('Missing access token', constants_1.GQLErrorCodes.NO_ACCESS_TOKEN);
        if (refreshToken) {
            oAuth2Client.setCredentials({
                access_token: accessToken,
                refresh_token: refreshToken,
            });
        }
        else {
            oAuth2Client.setCredentials({
                access_token: accessToken,
            });
        }
        const attendees = details.users.map((user) => ({ email: user === null || user === void 0 ? void 0 : user.email }));
        const event = {
            summary: details.name,
            description: details.description || `Event for ${details.name}`,
            start: {
                dateTime: details.startDate,
            },
            end: {
                dateTime: details.endDate,
            },
            location: details.location,
            attendees,
            reminders: {
                useDefault: false,
                overrides: [
                    { method: 'email', minutes: 24 * 60 },
                    { method: 'popup', minutes: 10 },
                ],
            },
            conferenceData: {
                createRequest: {
                    requestId: (0, uuid_1.v4)(),
                    conferenceSolutionKey: {
                        type: 'hangoutsMeet',
                    },
                },
            },
        };
        try {
            const res = yield calendar.events.insert({
                calendarId: 'primary',
                requestBody: event,
                conferenceDataVersion: 1,
            });
            const meeting = yield meeting_1.default.create(Object.assign(Object.assign({}, details), { meetingId: res.data.id }));
            return meeting;
        }
        catch (error) {
            console.log('There was an error contacting the Calendar service: ' + error);
            throw new Error('There was an error while creating event');
        }
    });
}
exports.addGoogleMeeting = addGoogleMeeting;
function cancelGoogleMeeting(context, meetingId) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        if (!context.auth)
            throw new Error('Unauthorized access');
        const userId = context.auth._id;
        const user = yield user_1.default.findOne({
            _id: userId,
        });
        if (!user)
            throw new Error('Unauthorized access');
        const accessToken = (_b = (_a = user.integration) === null || _a === void 0 ? void 0 : _a.google) === null || _b === void 0 ? void 0 : _b.accessToken;
        const refreshToken = (_d = (_c = user.integration) === null || _c === void 0 ? void 0 : _c.google) === null || _d === void 0 ? void 0 : _d.refreshToken;
        if (!accessToken)
            throw new index_1.GQLError('Missing access token', constants_1.GQLErrorCodes.NO_ACCESS_TOKEN);
        if (refreshToken) {
            oAuth2Client.setCredentials({
                access_token: accessToken,
                refresh_token: refreshToken,
            });
        }
        else {
            oAuth2Client.setCredentials({
                access_token: accessToken,
            });
        }
        try {
            yield calendar.events.delete({
                calendarId: 'primary',
                eventId: meetingId,
            });
            const meeting = yield meeting_1.default.findOneAndDelete({
                host: user._id,
                meetingId,
            });
            if (!meeting)
                throw new index_1.GQLError('Meeing does not exists.', constants_1.GQLErrorCodes.MEETING_DOES_NOT_EXIST);
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
            if (error instanceof Error && error.message.includes('Not Found'))
                throw new index_1.GQLError('Meeing does not exists.', constants_1.GQLErrorCodes.MEETING_DOES_NOT_EXIST);
            throw error;
        }
    });
}
exports.cancelGoogleMeeting = cancelGoogleMeeting;
