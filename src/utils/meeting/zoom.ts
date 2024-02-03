import { ObjectId } from 'mongoose';
import { AddMeetingInput } from '../../generated/graphql';
import { GraphqlContextFunctionArgument, MeetingType } from '../../types';
import joinMeetingTemplete from '../../templates/join-meeting';
import cancelMeetingTemplete from '../../templates/cancelMeeting';
import User from '../../models/user';
import {
  GQLErrorCodes,
  siteurl,
  zoomClientId,
  zoomSecretId,
  zoomTokenEndpoint,
} from '../../constants';
import Meeting from '../../models/meeting';
import { GQLError } from '..';
import axios, { AxiosError } from 'axios';
import { send } from '../email';

const zoomApiEndpoint = `https://api.zoom.us/v2`;

async function getAccessTokenFromRefreshToken(refreshToken: string) {
  const tokenEndpoint = zoomTokenEndpoint;
  const data = {
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: zoomClientId,
    client_secret: zoomSecretId,
  };

  try {
    const response = await axios.post(tokenEndpoint, null, { params: data });
    const newAccessToken = response.data.access_token;
    console.log('New Access Token:', newAccessToken);

    return newAccessToken;
  } catch (error) {
    if (error instanceof AxiosError)
      console.error(
        'Error refreshing token:',
        error.response ? error.response.data : error.message
      );
    console.error('Error refreshing token');
  }
}

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
  const refreshToken = user.integration?.zoom?.refreshToken;
  if (!accessToken)
    throw new GQLError('Missing access token', GQLErrorCodes.NO_ACCESS_TOKEN);
  const attendees: { email: string }[] = details.users.map((user) => ({
    email: user?.email || '',
  }));
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
    console.log('data', data.data.id);
    const meeting = await Meeting.create({
      ...details,
      meetingId: data.data.id,
    });
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
    if (error instanceof AxiosError) {
      if (error.response?.data.code === 124) {
        throw new GQLError(
          'Access token expired',
          GQLErrorCodes.NO_ACCESS_TOKEN
        );
      }
      throw error;
    }
    throw error;
  }
}

export async function cancelZoomMeeting(
  context: GraphqlContextFunctionArgument,
  meetingId: string
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

  try {
    await axios.delete(`${zoomApiEndpoint}/meetings/${meetingId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
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
    if (error instanceof AxiosError) {
      if (error.response?.data.code === 3001) {
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
