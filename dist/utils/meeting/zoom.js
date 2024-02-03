"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.cancelZoomMeeting = exports.addZoomMeeting = void 0;
const join_meeting_1 = __importDefault(require("../../templates/join-meeting"));
const cancelMeeting_1 = __importDefault(require("../../templates/cancelMeeting"));
const user_1 = __importDefault(require("../../models/user"));
const constants_1 = require("../../constants");
const meeting_1 = __importDefault(require("../../models/meeting"));
const __1 = require("..");
const axios_1 = __importStar(require("axios"));
const email_1 = require("../email");
const zoomApiEndpoint = `https://api.zoom.us/v2`;
function getAccessTokenFromRefreshToken(refreshToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const tokenEndpoint = constants_1.zoomTokenEndpoint;
        const data = {
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: constants_1.zoomClientId,
            client_secret: constants_1.zoomSecretId,
        };
        try {
            const response = yield axios_1.default.post(tokenEndpoint, null, { params: data });
            const newAccessToken = response.data.access_token;
            console.log('New Access Token:', newAccessToken);
            return newAccessToken;
        }
        catch (error) {
            if (error instanceof axios_1.AxiosError)
                console.error('Error refreshing token:', error.response ? error.response.data : error.message);
            console.error('Error refreshing token');
        }
    });
}
function addZoomMeeting(context, details) {
    var _a, _b, _c, _d, _e;
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
        const refreshToken = (_d = (_c = user.integration) === null || _c === void 0 ? void 0 : _c.zoom) === null || _d === void 0 ? void 0 : _d.refreshToken;
        if (!accessToken)
            throw new __1.GQLError('Missing access token', constants_1.GQLErrorCodes.NO_ACCESS_TOKEN);
        const attendees = details.users.map((user) => ({
            email: (user === null || user === void 0 ? void 0 : user.email) || '',
        }));
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
            console.log('data', data.data.id);
            const meeting = yield meeting_1.default.create(Object.assign(Object.assign({}, details), { meetingId: data.data.id }));
            yield (0, email_1.send)({
                to: user.email,
                subject: 'Zoom Meeting Invite From Fly IO',
                html: (0, join_meeting_1.default)('User', details.description || '', data.data.join_url),
                cc: attendees.join(),
            });
            return meeting;
        }
        catch (error) {
            if (error instanceof axios_1.AxiosError) {
                if (((_e = error.response) === null || _e === void 0 ? void 0 : _e.data.code) === 124) {
                    throw new __1.GQLError('Access token expired', constants_1.GQLErrorCodes.NO_ACCESS_TOKEN);
                }
                throw error;
            }
            throw error;
        }
    });
}
exports.addZoomMeeting = addZoomMeeting;
function cancelZoomMeeting(context, meetingId) {
    var _a, _b, _c;
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
        try {
            yield axios_1.default.delete(`${zoomApiEndpoint}/meetings/${meetingId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
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
                if (((_c = error.response) === null || _c === void 0 ? void 0 : _c.data.code) === 3001) {
                    throw new __1.GQLError('Meeing does not exists.', constants_1.GQLErrorCodes.MEETING_DOES_NOT_EXIST);
                }
                throw error;
            }
            throw error;
        }
    });
}
exports.cancelZoomMeeting = cancelZoomMeeting;
