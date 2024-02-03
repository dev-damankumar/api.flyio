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
exports.cancelMicrosoftMeeting = exports.addTeamsMeeting = void 0;
const microsoft_graph_client_1 = require("@microsoft/microsoft-graph-client");
const user_1 = __importDefault(require("../../models/user"));
const moment_1 = __importDefault(require("moment"));
const constants_1 = require("../../constants");
const meeting_1 = __importDefault(require("../../models/meeting"));
const __1 = require("..");
const email_1 = require("../email");
const cancelMeeting_1 = __importDefault(require("../../templates/cancelMeeting"));
function addTeamsMeeting(context, details) {
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
        const accessToken = (_b = (_a = user.integration) === null || _a === void 0 ? void 0 : _a.microsoft) === null || _b === void 0 ? void 0 : _b.accessToken;
        if (!accessToken)
            throw new __1.GQLError('Missing access token', constants_1.GQLErrorCodes.NO_ACCESS_TOKEN);
        const attendees = details.users.map((user) => ({
            emailAddress: { address: user === null || user === void 0 ? void 0 : user.email },
            type: 'required',
        }));
        console.log('accessToken', accessToken);
        const client = microsoft_graph_client_1.Client.init({
            authProvider: (done) => {
                done(null, accessToken);
            },
        });
        const event = {
            subject: details.name,
            start: {
                dateTime: (0, moment_1.default)(details.startDate).toISOString(),
                timeZone: details.location || 'Asia/Calcutta',
            },
            end: {
                dateTime: (0, moment_1.default)(details.endDate).toISOString(),
                timeZone: details.location || 'Asia/Calcutta',
            },
            body: {
                content: (details === null || details === void 0 ? void 0 : details.description) || 'Teams Meeting',
                contentType: 'HTML',
            },
            isOnlineMeeting: true,
            onlineMeetingProvider: 'teamsForBusiness',
            attendees: [
                {
                    emailAddress: {
                        address: details.host,
                    },
                    type: 'required',
                },
                ...attendees,
            ],
        };
        try {
            const data = yield client.api('/me/events').post(Object.assign({}, event));
            console.log('data', data);
            const meeting = yield meeting_1.default.create(Object.assign(Object.assign({}, details), { meetingId: data.id }));
            return meeting;
        }
        catch (error) {
            console.error(error);
            if (error instanceof microsoft_graph_client_1.GraphError &&
                error.code === 'InvalidAuthenticationToken') {
                throw new __1.GQLError('Missing access token', constants_1.GQLErrorCodes.NO_ACCESS_TOKEN);
            }
            throw error;
        }
    });
}
exports.addTeamsMeeting = addTeamsMeeting;
function cancelMicrosoftMeeting(context, meetingId) {
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
        const accessToken = (_b = (_a = user.integration) === null || _a === void 0 ? void 0 : _a.microsoft) === null || _b === void 0 ? void 0 : _b.accessToken;
        if (!accessToken)
            throw new __1.GQLError('Missing access token', constants_1.GQLErrorCodes.NO_ACCESS_TOKEN);
        const client = microsoft_graph_client_1.Client.init({
            authProvider: (done) => {
                done(null, accessToken);
            },
        });
        try {
            yield client.api(`/me/events/${meetingId}`).delete();
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
            console.log('error', error);
            if (error instanceof microsoft_graph_client_1.GraphError) {
                if (error.code === 'ErrorItemNotFound') {
                    throw new __1.GQLError('Meeing does not exists.', constants_1.GQLErrorCodes.MEETING_DOES_NOT_EXIST);
                }
                throw error;
            }
            throw error;
        }
    });
}
exports.cancelMicrosoftMeeting = cancelMicrosoftMeeting;
