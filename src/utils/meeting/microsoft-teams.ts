import { ObjectId } from 'mongoose';
import { AddMeetingInput } from '../../generated/graphql';
import { GraphqlContextFunctionArgument, MeetingType } from '../../types';
import { Client, GraphError } from '@microsoft/microsoft-graph-client';
import User from '../../models/user';
import moment from 'moment';
import { GQLErrorCodes, siteurl } from '../../constants';
import Meeting from '../../models/meeting';
import { GQLError } from '..';
import { send } from '../email';
import cancelMeetingTemplete from '../../templates/cancelMeeting';
export async function addTeamsMeeting(
  context: GraphqlContextFunctionArgument,
  details: AddMeetingInput & { type: MeetingType; host: string | ObjectId }
) {
  if (!context.auth) throw new Error('Unauthorized access');
  const userId = context.auth._id;
  const user = await User.findOne({
    _id: userId,
  });
  if (!user) throw new Error('Unauthorized access');
  const accessToken = user.integration?.microsoft?.accessToken;
  if (!accessToken)
    throw new GQLError('Missing access token', GQLErrorCodes.NO_ACCESS_TOKEN);
  const attendees = details.users.map((user) => ({
    emailAddress: { address: user?.email },
    type: 'required',
  }));
  console.log('accessToken', accessToken);
  const client = Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    },
  });

  const event = {
    subject: details.name,
    start: {
      dateTime: moment(details.startDate).toISOString(),
      timeZone: details.location || 'Asia/Calcutta',
    },
    end: {
      dateTime: moment(details.endDate).toISOString(),
      timeZone: details.location || 'Asia/Calcutta',
    },
    body: {
      content: details?.description || 'Teams Meeting',
      contentType: 'HTML',
    },
    isOnlineMeeting: true,
    onlineMeetingProvider: 'teamsForBusiness',
    attendees: [
      {
        emailAddress: {
          address: details.host,
        },
        type: 'required',
      },
      ...attendees,
    ],
  };

  try {
    const data = await client.api('/me/events').post({ ...event });
    console.log('data', data);
    const meeting = await Meeting.create({
      ...details,
      meetingId: data.id,
    });
    return meeting;
  } catch (error) {
    console.error(error);
    if (
      error instanceof GraphError &&
      error.code === 'InvalidAuthenticationToken'
    ) {
      throw new GQLError('Missing access token', GQLErrorCodes.NO_ACCESS_TOKEN);
    }
    throw error;
  }
}

export async function cancelMicrosoftMeeting(
  context: GraphqlContextFunctionArgument,
  meetingId: string
) {
  if (!context.auth) throw new Error('Unauthorized access');
  const userId = context.auth._id;
  const user = await User.findOne({
    _id: userId,
  });
  if (!user) throw new Error('Unauthorized access');
  const accessToken = user.integration?.microsoft?.accessToken;
  if (!accessToken)
    throw new GQLError('Missing access token', GQLErrorCodes.NO_ACCESS_TOKEN);
  const client = Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    },
  });
  try {
    await client.api(`/me/events/${meetingId}`).delete();
    const meeting = await Meeting.findOneAndDelete({
      host: user._id,
      meetingId,
    });
    if (!meeting)
      throw new GQLError(
        'Meeing does not exists.',
        GQLErrorCodes.MEETING_DOES_NOT_EXIST
      );
    const attendees: string[] = meeting.users.map((user) => user?.email || '');
    await send({
      to: user.email,
      subject: 'Fly io Meeting Cancelled',
      html: cancelMeetingTemplete(
        'Flyio User',
        `${siteurl}/dashboard`,
        meeting?.name
      ),
      cc: attendees.join(),
    });
    return {
      message: 'We have cancel your meeting',
      status: 200,
      type: 'success',
    };
  } catch (error) {
    console.log('error', error);
    if (error instanceof GraphError) {
      if (error.code === 'ErrorItemNotFound') {
        throw new GQLError(
          'Meeing does not exists.',
          GQLErrorCodes.MEETING_DOES_NOT_EXIST
        );
      }
      throw error;
    }
    throw error;
  }
}
