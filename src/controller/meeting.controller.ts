import { AddMeetingInput, IMeetingFilter } from '../generated/graphql';
import Meeting from '../models/meeting';
import { GraphqlContextFunctionArgument, MeetingType } from '../types';
import { getTodayDateRange, gettomorrowDateRange } from '../utils/date';
import { addMeeting, cancelMeeting } from '../utils/meeting/index';

const getMeetingsHandler = async (
  context: GraphqlContextFunctionArgument,
  data: IMeetingFilter
) => {
  if (!context.auth) throw new Error('Unauthorized access');
  const match: { [any: string]: any } = { host: context.auth._id };
  console.log('data', data);
  const { todayEndDate, todayNowDate, todayStartDate } = getTodayDateRange();
  const { tomorrowEndDate, tomorrowStartDate } = gettomorrowDateRange();
  if (data?.today) {
    match.startDate = { $gte: todayNowDate, $lt: todayEndDate };
  } else if (data?.tomorrow) {
    match.startDate = { $gte: tomorrowStartDate, $lt: tomorrowEndDate };
  } else if (data?.someday) {
    match.startDate = { $gt: tomorrowEndDate };
  } else {
    match.startDate = { $lt: todayNowDate };
    console.log('here', data);
  }
  const meetings = await Meeting.find(match).sort('startDate').exec();
  return meetings;
};

const addMeetingHandler = async (
  context: GraphqlContextFunctionArgument,
  data: AddMeetingInput & { type: MeetingType }
) => {
  if (!context.auth) throw new Error('Unauthorized access');
  const host = context.auth._id;
  return await addMeeting(context, data.type, { ...data, host });
};

const cancelMeetingHandler = async (
  context: GraphqlContextFunctionArgument,
  data: { type: MeetingType; meetingId: string }
) => {
  if (!context.auth) throw new Error('Unauthorized access');
  const host = context.auth._id;
  return await cancelMeeting(context, data.type, data.meetingId);
};

const checkIfUserisInvited = async (
  context: GraphqlContextFunctionArgument,
  data: { meetingId: string }
) => {
  if (!context.auth) throw new Error('Unauthorized access');
  const userId = context.auth._id;
  const meetingId = data.meetingId;
  const user = await Meeting.findOne({
    meetingId,
    $or: [{ host: userId }, { 'users._id': userId }],
  });

  return { verified: !!user };
};
export default {
  getMeetingsHandler,
  addMeetingHandler,
  checkIfUserisInvited,
  cancelMeetingHandler,
};
