import { AddMeetingInput } from '../../generated/graphql';
import { GraphqlContextFunctionArgument } from '../../types';
import Meeting from '../../models/meeting';
import shortid from 'shortid';
import { ObjectId } from 'mongoose';
import path from 'path';
import { send } from '../email';
import joinMeetingTemplete from '../../templates/join-meeting';
import cancelMeetingTemplete from '../../templates/cancelMeeting';
import { GQLErrorCodes, siteurl } from '../../constants';
import User from '../../models/user';
import { AxiosError } from 'axios';
import { GQLError } from '..';

type TFLyIoMeeting = AddMeetingInput & {
  host: string | ObjectId;
  meetingId: string;
  url: string;
};
export async function addFlyIOMeeting(
  context: GraphqlContextFunctionArgument,
  details: AddMeetingInput & {
    host: string | ObjectId;
  }
) {
  try {
    const event: TFLyIoMeeting = details as TFLyIoMeeting;
    const meetingId = shortid.generate();
    event.meetingId = meetingId;
    event.url = path.join('/', 'flyio', meetingId);
    const attendees: string[] = details.users.map((user) => user?.email || '');
    const user = await User.findOne({ _id: details.host });
    if (!user) throw new Error('no user found.');
    const meet = await Meeting.create(event);
    await send({
      to: user.email,
      subject: 'Fly io Meeting Invite',
      html: joinMeetingTemplete(
        'User',
        details.description || '',
        `${siteurl}/${event.url}`
      ),
      cc: attendees.join(),
    });
    return meet;
  } catch (error) {
    console.log('There was an error contacting the Calendar service: ' + error);
    throw new Error('There was an error while creating event');
  }
}

export async function cancelFlyIOMeeting(
  context: GraphqlContextFunctionArgument,
  meetingId: string
) {
  if (!context.auth) throw new Error('Unauthorized access');
  const userId = context.auth._id;
  const user = await User.findOne({
    _id: userId,
  });
  if (!user) throw new Error('Unauthorized access');
  try {
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
