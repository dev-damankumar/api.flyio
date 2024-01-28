import path from "path";

export const _prod_ = process.env.NODE_ENV === "production";
export const mockSMTP = process.env.MOCK_SMTP === "true";
export const _dev_ = process.env.NODE_ENV === "development";
export const db = process.env.DB!;
export const secretPath = process.env.SECRET_PATH!;
export const port = process.env.PORT!;
export const jwtSecret = process.env.JWT_SECRET!;
export const siteurl = process.env.WEB_URL!;
export const googleMeetClientEmail = process.env.GOOGLE_MEET_CLIENT_EMAIL!;
export const googleMeetProjectNumber = process.env.GOOGLE_PROJECT_NUMBER!;
export const googleMeetCalenderId = process.env.GOOGLE_CALENDER_ID!;
export const SCOPES = ["https://www.googleapis.com/auth/calendar"];
export const impersonatedUser = process.env.IMPERSONATED_USER;
export const googleMeetPrivateKey = process.env
  .GOOGLE_MEET_PRIVATE_KEY!.split(String.raw`\n`)
  .join("\n");
export const email = {
  from: process.env.FROM_EMAIL,
};

const devFilePath = path.join(process.cwd(), "google-meet-credentials.json");
const prodFilePath = path.resolve(
  "/",
  secretPath,
  "google-meet-credentials.json"
);
export const CREDENTIALS_PATH = _prod_ ? prodFilePath : devFilePath;
