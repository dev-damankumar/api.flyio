import { ObjectId } from 'mongoose';
import { AddMeetingInput } from '../../generated/graphql';
import { GraphqlContextFunctionArgument, MeetingType } from '../../types';
import { addGoogleMeeting } from './google-meet';
import { addFlyIOMeeting } from './fly-io';
import { addTeamsMeeting } from './microsoft-teams';
import { addZoomMeeting } from './zoom';

const meetingTypes = {
  'google-meet': {
    add: addGoogleMeeting,
  },
  'microsoft-teams': {
    add: addTeamsMeeting,
  },
  zoom: {
    add: addZoomMeeting,
  },
  'fly-io': {
    add: addFlyIOMeeting,
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
