import User from '../../models/user';
import { google } from 'googleapis';

import { v4 as uuidv4 } from 'uuid';
import {
  GQLErrorCodes,
  googleClientId,
  googleSecretId,
  siteurl,
} from '../../constants';
import { AddMeetingInput } from '../../generated/graphql';
import Meeting from '../../models/meeting';
import { GraphqlContextFunctionArgument, MeetingType } from '../../types';
import { ObjectId } from 'mongoose';
import { GQLError } from '../index';
import { send } from '../email';
import cancelMeetingTemplete from '../../templates/cancelMeeting';
const oAuth2Client = new google.auth.OAuth2(googleClientId, googleSecretId);

const calendar = google.calendar({
  version: 'v3',
  auth: oAuth2Client,
});

export async function addGoogleMeeting(
  context: GraphqlContextFunctionArgument,
  details: AddMeetingInput & { type: MeetingType; host: string | ObjectId }
) {
  if (!context.auth) throw new Error('Unauthorized access');
  const userId = context.auth._id;
  const user = await User.findOne({
    _id: userId,
  });
  if (!user) throw new Error('Unauthorized access');
  const accessToken = user.integration?.google?.accessToken;
  const refreshToken = user.integration?.google?.refreshToken;
  if (!accessToken)
    throw new GQLError('Missing access token', GQLErrorCodes.NO_ACCESS_TOKEN);
  if (refreshToken) {
    oAuth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  } else {
    oAuth2Client.setCredentials({
      access_token: accessToken,
    });
  }
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
        { method: 'email', minutes: 24 * 60 },
        { method: 'popup', minutes: 10 },
      ],
    },
    conferenceData: {
      createRequest: {
        requestId: uuidv4(),
        conferenceSolutionKey: {
          type: 'hangoutsMeet',
        },
      },
    },
  };
  try {
    const res = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
      conferenceDataVersion: 1,
    });
    const meeting = await Meeting.create({
      ...details,
      meetingId: res.data.id,
    });
    return meeting;
  } catch (error) {
    console.log('There was an error contacting the Calendar service: ' + error);
    throw new Error('There was an error while creating event');
  }
}

export async function cancelGoogleMeeting(
  context: GraphqlContextFunctionArgument,
  meetingId: string
) {
  if (!context.auth) throw new Error('Unauthorized access');
  const userId = context.auth._id;
  const user = await User.findOne({
    _id: userId,
  });
  if (!user) throw new Error('Unauthorized access');
  const accessToken = user.integration?.google?.accessToken;
  const refreshToken = user.integration?.google?.refreshToken;
  if (!accessToken)
    throw new GQLError('Missing access token', GQLErrorCodes.NO_ACCESS_TOKEN);
  if (refreshToken) {
    oAuth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  } else {
    oAuth2Client.setCredentials({
      access_token: accessToken,
    });
  }
  try {
    await calendar.events.delete({
      calendarId: 'primary',
      eventId: meetingId,
    });

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
    if (error instanceof Error && error.message.includes('Not Found'))
      throw new GQLError(
        'Meeing does not exists.',
        GQLErrorCodes.MEETING_DOES_NOT_EXIST
      );
    throw error;
  }
}
