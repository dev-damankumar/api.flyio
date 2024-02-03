export const _prod_ = process.env.NODE_ENV === 'production';
export const mockSMTP = process.env.MOCK_SMTP === 'true';
export const _dev_ = process.env.NODE_ENV === 'development';
export const db = process.env.DB!;
export const port = process.env.PORT!;
export const jwtSecret = process.env.JWT_SECRET!;
export const siteurl = process.env.WEB_URL!;

export const sendGridApiKey = process.env.SENDGRID_API_KEY!;

export const googleAuthEndpoint = process.env.GOOGLE_AUTH_ENDPOINT!;
export const googleTokenEndpoint = process.env.GOOGLE_TOKEN_ENDPOINT!;
export const googleClientId = process.env.GOOGLE_CLIENT_ID!;
export const googleSecretId = process.env.GOOGLE_SECRET_ID!;
export const googleRedirectUri = process.env.GOOGLE_REDIRECT_ENDPOINT!;
export const googleScope = 'profile https://www.googleapis.com/auth/calendar';

export const microsoftAuthEndpoint = process.env.MICROSOFT_AUTH_ENDPOINT!;
export const microsoftTokenEndpoint = process.env.MICROSOFT_TOKEN_ENDPOINT!;
export const microsoftClientId = process.env.MICROSOFT_CLIENT_ID!;
export const microsoftSecretId = process.env.MICROSOFT_SECRET_ID!;
export const microsoftRedirectUri = process.env.MICROSOFT_REDIRECT_ENDPOINT!;
export const microsoftScope =
  'openid profile Calendars.ReadWrite offline_access';

export const zoomAuthEndpoint = process.env.ZOOM_AUTH_ENDPOINT!;
export const zoomTokenEndpoint = process.env.ZOOM_TOKEN_ENDPOINT!;
export const zoomClientId = process.env.ZOOM_CLIENT_ID!;
export const zoomSecretId = process.env.ZOOM_SECRET_ID!;
export const zoomRedirectUri = process.env.ZOOM_REDIRECT_ENDPOINT!;
export const zoomScope = 'user:read user:write meeting:write';

export const email = {
  from: process.env.FROM_EMAIL,
};

export const GQLErrorCodes = {
  NO_ACCESS_TOKEN: 'NO_ACCESS_TOKEN',
  MEETING_DOES_NOT_EXIST: 'MEETING_DOES_NOT_EXIST',
};
