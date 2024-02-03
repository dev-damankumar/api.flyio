"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GQLErrorCodes = exports.email = exports.zoomScope = exports.zoomRedirectUri = exports.zoomSecretId = exports.zoomClientId = exports.zoomTokenEndpoint = exports.zoomAuthEndpoint = exports.microsoftScope = exports.microsoftRedirectUri = exports.microsoftSecretId = exports.microsoftClientId = exports.microsoftTokenEndpoint = exports.microsoftAuthEndpoint = exports.googleScope = exports.googleRedirectUri = exports.googleSecretId = exports.googleClientId = exports.googleTokenEndpoint = exports.googleAuthEndpoint = exports.sendGridApiKey = exports.siteurl = exports.jwtSecret = exports.port = exports.db = exports._dev_ = exports.mockSMTP = exports._prod_ = void 0;
exports._prod_ = process.env.NODE_ENV === 'production';
exports.mockSMTP = process.env.MOCK_SMTP === 'true';
exports._dev_ = process.env.NODE_ENV === 'development';
exports.db = process.env.DB;
exports.port = process.env.PORT;
exports.jwtSecret = process.env.JWT_SECRET;
exports.siteurl = process.env.WEB_URL;
exports.sendGridApiKey = process.env.SENDGRID_API_KEY;
exports.googleAuthEndpoint = process.env.GOOGLE_AUTH_ENDPOINT;
exports.googleTokenEndpoint = process.env.GOOGLE_TOKEN_ENDPOINT;
exports.googleClientId = process.env.GOOGLE_CLIENT_ID;
exports.googleSecretId = process.env.GOOGLE_SECRET_ID;
exports.googleRedirectUri = process.env.GOOGLE_REDIRECT_ENDPOINT;
exports.googleScope = 'profile https://www.googleapis.com/auth/calendar';
exports.microsoftAuthEndpoint = process.env.MICROSOFT_AUTH_ENDPOINT;
exports.microsoftTokenEndpoint = process.env.MICROSOFT_TOKEN_ENDPOINT;
exports.microsoftClientId = process.env.MICROSOFT_CLIENT_ID;
exports.microsoftSecretId = process.env.MICROSOFT_SECRET_ID;
exports.microsoftRedirectUri = process.env.MICROSOFT_REDIRECT_ENDPOINT;
exports.microsoftScope = 'openid profile Calendars.ReadWrite offline_access';
exports.zoomAuthEndpoint = process.env.ZOOM_AUTH_ENDPOINT;
exports.zoomTokenEndpoint = process.env.ZOOM_TOKEN_ENDPOINT;
exports.zoomClientId = process.env.ZOOM_CLIENT_ID;
exports.zoomSecretId = process.env.ZOOM_SECRET_ID;
exports.zoomRedirectUri = process.env.ZOOM_REDIRECT_ENDPOINT;
exports.zoomScope = 'user:read user:write meeting:write';
exports.email = {
    from: process.env.FROM_EMAIL,
};
exports.GQLErrorCodes = {
    NO_ACCESS_TOKEN: 'NO_ACCESS_TOKEN',
    MEETING_DOES_NOT_EXIST: 'MEETING_DOES_NOT_EXIST',
};
