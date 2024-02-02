"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GQLErrorCodes = exports.CREDENTIALS_PATH = exports.email = exports.impersonatedUser = exports.SCOPES = exports.zoomSecretId = exports.zoomClientId = exports.googleSecretId = exports.googleClientId = exports.googleMeetCalenderId = exports.googleMeetProjectNumber = exports.googleMeetClientEmail = exports.microsoftSecretValue = exports.microsoftSecretId = exports.microsoftTenentId = exports.microsoftClientId = exports.sendGridApiKey = exports.siteurl = exports.jwtSecret = exports.port = exports.secretPath = exports.db = exports._dev_ = exports.mockSMTP = exports._prod_ = void 0;
const path_1 = __importDefault(require("path"));
exports._prod_ = process.env.NODE_ENV === 'production';
exports.mockSMTP = process.env.MOCK_SMTP === 'true';
exports._dev_ = process.env.NODE_ENV === 'development';
exports.db = process.env.DB;
exports.secretPath = process.env.SECRET_PATH;
exports.port = process.env.PORT;
exports.jwtSecret = process.env.JWT_SECRET;
exports.siteurl = process.env.WEB_URL;
exports.sendGridApiKey = process.env.SENDGRID_API_KEY;
exports.microsoftClientId = process.env.MICROSOFT_CLIENT_ID;
exports.microsoftTenentId = process.env.MICROSOFT_TENENT_ID;
exports.microsoftSecretId = process.env.MICROSOFT_SECRET_ID;
exports.microsoftSecretValue = process.env.MICROSOFT_SECRET_VALUE;
exports.googleMeetClientEmail = process.env.GOOGLE_MEET_CLIENT_EMAIL;
exports.googleMeetProjectNumber = process.env.GOOGLE_PROJECT_NUMBER;
exports.googleMeetCalenderId = process.env.GOOGLE_CALENDER_ID;
exports.googleClientId = process.env.GOOGLE_CLIENT_ID;
exports.googleSecretId = process.env.GOOGLE_SECRET_ID;
exports.zoomClientId = process.env.ZOOM_CLIENT_ID;
exports.zoomSecretId = process.env.ZOOM_SECRET_ID;
exports.SCOPES = ['https://www.googleapis.com/auth/calendar'];
exports.impersonatedUser = process.env.IMPERSONATED_USER;
exports.email = {
    from: process.env.FROM_EMAIL,
};
const devFilePath = path_1.default.join(process.cwd(), 'google-meet-credentials.json');
const prodFilePath = path_1.default.resolve('/', exports.secretPath, 'google-meet-credentials.json');
exports.CREDENTIALS_PATH = exports._prod_ ? prodFilePath : devFilePath;
exports.GQLErrorCodes = {
    NO_ACCESS_TOKEN: 'NO_ACCESS_TOKEN',
};
