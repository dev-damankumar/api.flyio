import { AddMeetingInput } from '../../generated/graphql';
import { GraphqlContextFunctionArgument } from '../../types';
import Meeting from '../../models/meeting';
import shortid from 'shortid';
import { ObjectId } from 'mongoose';
import path from 'path';
import { send } from '../email';
import joinMeetingTemplete from '../../templates/join-meeting';
import { siteurl } from '../../constants';
import User from '../../models/user';

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
      subject: 'Forgot Password',
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
