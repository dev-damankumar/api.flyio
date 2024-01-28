import { ExpressContextFunctionArgument } from "@apollo/server/dist/esm/express4";

export type GraphqlContextFunctionArgument = ExpressContextFunctionArgument & {
  auth: { _id: string; email: string } | null;
};

export type JWTPayload = {
  email: string;
  _id: string;
  iat: number;
} | null;

export const timeSlots = [
  "9:00 am - 9:30 am",
  "9:30 am - 10:00 am",
  "10:00 am - 10:30 am",
  "10:30 am - 11:00 am",
  "11:00 am - 11:30 am",
  "11:30 am - 12:00 pm",
  "12:00 pm - 12:30 pm",
] as const;

export type MeetingType = "google-meet" | "microsoft-teams" | "zoom" | "fly-io";
export type TTimeSlots = (typeof timeSlots)[number];
