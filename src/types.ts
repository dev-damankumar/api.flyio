import { ExpressContextFunctionArgument } from '@apollo/server/dist/esm/express4';

export type GraphqlContextFunctionArgument = ExpressContextFunctionArgument & {
  auth: { _id: string; email: string } | null;
};

export type JWTPayload = {
  email: string;
  _id: string;
  iat: number;
} | null;

export const timeSlots = [
  '9:00 am - 9:30 am',
  '9:30 am - 10:00 am',
  '10:00 am - 10:30 am',
  '10:30 am - 11:00 am',
  '11:00 am - 11:30 am',
  '11:30 am - 12:00 pm',
  '12:00 pm - 12:30 pm',
  '12:30 pm - 01:00 pm',
  '01:00 pm - 01:30 pm',
  '01:30 pm - 02:00 pm',
  '02:00 pm - 02:30 pm',
  '02:30 pm - 03:00 pm',
  '03:00 pm - 03:30 pm',
  '03:30 pm - 04:00 pm',
  '04:00 pm - 04:30 pm',
  '04:30 pm - 05:00 pm',
  '05:00 pm - 05:30 pm',
  '05:30 pm - 06:00 pm',
  '06:00 pm - 06:30 pm',
  '06:30 pm - 07:00 pm',
] as const;

export type MeetingType = 'google-meet' | 'microsoft-teams' | 'zoom' | 'fly-io';
export type TTimeSlots = (typeof timeSlots)[number];
