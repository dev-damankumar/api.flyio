import { ObjectId } from 'mongoose';
import { AddMeetingInput } from '../../generated/graphql';
import { GraphqlContextFunctionArgument, MeetingType } from '../../types';
import { addGoogleMeeting, cancelGoogleMeeting } from './google-meet';
import { addFlyIOMeeting, cancelFlyIOMeeting } from './fly-io';
import { addTeamsMeeting, cancelMicrosoftMeeting } from './microsoft-teams';
import { addZoomMeeting, cancelZoomMeeting } from './zoom';

const meetingTypes = {
  'google-meet': {
    add: addGoogleMeeting,
    cancel: cancelGoogleMeeting,
  },
  'microsoft-teams': {
    add: addTeamsMeeting,
    cancel: cancelMicrosoftMeeting,
  },
  zoom: {
    add: addZoomMeeting,
    cancel: cancelZoomMeeting,
  },
  'fly-io': {
    add: addFlyIOMeeting,
    cancel: cancelFlyIOMeeting,
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

export async function cancelMeeting(
  context: GraphqlContextFunctionArgument,
  type: MeetingType,
  meetingId: string
) {
  const Meet = meetingTypes[type];
  const data = await Meet.cancel(context, meetingId);
  return data;
}
