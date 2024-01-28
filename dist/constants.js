"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CREDENTIALS_PATH = exports.email = exports.googleMeetPrivateKey = exports.impersonatedUser = exports.SCOPES = exports.googleMeetCalenderId = exports.googleMeetProjectNumber = exports.googleMeetClientEmail = exports.siteurl = exports.jwtSecret = exports.port = exports.db = exports._dev_ = exports.mockSMTP = exports._prod_ = void 0;
const path_1 = __importDefault(require("path"));
exports._prod_ = process.env.NODE_ENV === "production";
exports.mockSMTP = process.env.MOCK_SMTP === "true";
exports._dev_ = process.env.NODE_ENV === "development";
exports.db = process.env.DB;
exports.port = process.env.PORT;
exports.jwtSecret = process.env.JWT_SECRET;
exports.siteurl = process.env.WEB_URL;
exports.googleMeetClientEmail = process.env.GOOGLE_MEET_CLIENT_EMAIL;
exports.googleMeetProjectNumber = process.env.GOOGLE_PROJECT_NUMBER;
exports.googleMeetCalenderId = process.env.GOOGLE_CALENDER_ID;
exports.SCOPES = ["https://www.googleapis.com/auth/calendar"];
exports.impersonatedUser = process.env.IMPERSONATED_USER;
exports.googleMeetPrivateKey = process.env
    .GOOGLE_MEET_PRIVATE_KEY.split(String.raw `\n`)
    .join("\n");
exports.email = {
    from: process.env.FROM_EMAIL,
};
exports.CREDENTIALS_PATH = path_1.default.join(process.cwd(), "google-meet-credentials.json");
