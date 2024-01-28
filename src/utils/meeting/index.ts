import { AddMeetingInput } from "../../generated/graphql";
import { MeetingType } from "../../types";
import { addGoogleMeeting, getGoogleMeetings } from "./google-meet";

const meetingTypes = {
  "google-meet": {
    add: addGoogleMeeting,
    get: getGoogleMeetings,
  },
  "microsoft-teams": {
    add: addGoogleMeeting,
    get: getGoogleMeetings,
  },
  zoom: {
    add: addGoogleMeeting,
    get: getGoogleMeetings,
  },
  "fly-io": {
    add: addGoogleMeeting,
    get: getGoogleMeetings,
  },
};
export async function addMeeting(type: MeetingType, details: AddMeetingInput) {
  const Meet = meetingTypes[type];
  const data = await Meet.add(details);
  return data;
}
