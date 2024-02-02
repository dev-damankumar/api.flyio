import { ObjectId } from 'mongoose';
import { AddMeetingInput } from '../../generated/graphql';
import { GraphqlContextFunctionArgument, MeetingType } from '../../types';
import joinMeetingTemplete from '../../templates/join-meeting';

import User from '../../models/user';
import { GQLErrorCodes, zoomClientId, zoomSecretId } from '../../constants';
import Meeting from '../../models/meeting';
import { GQLError } from '..';
import axios from 'axios';
import { send } from '../email';

export async function addZoomMeeting(
  context: GraphqlContextFunctionArgument,
  details: AddMeetingInput & { type: MeetingType; host: string | ObjectId }
) {
  if (!context.auth) throw new Error('Unauthorized access');
  const userId = context.auth._id;
  const user = await User.findOne({
    _id: userId,
  });
  if (!user) throw new Error('Unauthorized access');
  const accessToken = user.integration?.zoom?.accessToken;
  if (!accessToken)
    throw new GQLError('Missing access token', GQLErrorCodes.NO_ACCESS_TOKEN);
  const attendees = details.users.map((user) => ({ email: user?.email }));
  const event = {
    topic: details.name,
    type: 2,
    start_time: details.startDate,
    duration: 30,
    timezone: details.location || 'Asia/Calcutta',
    settings: {
      approval_type: 2,
      join_before_host: true,
      meeting_authentication: true,
    },
    agenda: details.description,
    invitees: attendees,
  };

  try {
    const data = await axios.post(
      'https://api.zoom.us/v2/users/me/meetings',
      event,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const meeting = await Meeting.create({ ...details });
    await send({
      to: user.email,
      subject: 'Zoom Meeting Invite From Fly IO',
      html: joinMeetingTemplete(
        'User',
        details.description || '',
        data.data.join_url
      ),
      cc: attendees.join(),
    });
    return meeting;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
