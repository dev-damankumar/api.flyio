import { ObjectId } from "mongoose";
import { AddMeetingInput } from "../../generated/graphql";
import { GraphqlContextFunctionArgument, MeetingType } from "../../types";
import { addGoogleMeeting, getGoogleMeetings } from "./google-meet";
import { addFlyIOMeeting } from "./fly-io";

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
    add: addFlyIOMeeting,
    get: getGoogleMeetings,
  },
};
export async function addMeeting(
  context: GraphqlContextFunctionArgument,
  type: MeetingType,
  details: AddMeetingInput & { type: MeetingType; host: string | ObjectId }
) {
  const Meet = meetingTypes[type];
  const data = await Meet.add(context, details);
  return data;
}
