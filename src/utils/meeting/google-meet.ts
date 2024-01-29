import { google } from "googleapis";
import { v4 as uuidv4 } from "uuid";
import {
  CREDENTIALS_PATH,
  SCOPES,
  googleMeetCalenderId,
  googleMeetClientEmail,
  impersonatedUser,
} from "../../constants";
import { AddMeetingInput } from "../../generated/graphql";
import Meeting from "../../models/meeting";
import { MeetingType } from "../../types";
import { ObjectId } from "mongoose";
const gMeetFile = require(CREDENTIALS_PATH);
console.log("gMeetFile", gMeetFile);

const auth = new google.auth.JWT(
  googleMeetClientEmail,
  CREDENTIALS_PATH,
  gMeetFile.private_key,
  SCOPES,
  impersonatedUser
);

const calendar = google.calendar({
  version: "v3",
  auth,
});

export async function getGoogleMeetings() {
  const result = await calendar.events.list({
    calendarId: googleMeetCalenderId,
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: "startTime",
  });
  const meetings = result.data.items;
  return meetings;
}

export async function addGoogleMeeting(
  _: any,
  details: AddMeetingInput & { type: MeetingType; host: string | ObjectId }
) {
  const attendees = details.users.map((user) => ({ email: user?.email }));
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
        { method: "email", minutes: 24 * 60 },
        { method: "popup", minutes: 10 },
      ],
    },
    conferenceData: {
      createRequest: {
        requestId: uuidv4(),
        conferenceSolutionKey: {
          type: "hangoutsMeet",
        },
      },
    },
  };
  try {
    await calendar.events.insert({
      calendarId: googleMeetCalenderId,
      requestBody: event,
      conferenceDataVersion: 1,
    });
    const meeting = await Meeting.create({ ...details });
    return meeting;
  } catch (error) {
    console.log("There was an error contacting the Calendar service: " + error);
    throw new Error("There was an error while creating event");
  }
}
