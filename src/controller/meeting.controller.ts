import { AddMeetingInput, IMeetingFilter } from "../generated/graphql";
import Meeting from "../models/meeting";
import { GraphqlContextFunctionArgument, MeetingType } from "../types";
import { getTodayDateRange, getTommorrowDateRange } from "../utils/date";
import { addMeeting } from "../utils/meeting/index";

const getMeetingsHandler = async (
  context: GraphqlContextFunctionArgument,
  data: IMeetingFilter
) => {
  if (!context.auth) throw new Error("Unauthorized access");
  const match: { [any: string]: any } = { host: context.auth._id };
  if (data?.today) {
    const { todayEndDate, todayStartDate } = getTodayDateRange();
    match.startDate = { $gte: todayStartDate, $lt: todayEndDate };
  }
  if (data?.tommorrow) {
    const { tommorrowEndDate, tommorrowStartDate } = getTommorrowDateRange();
    match.startDate = { $gte: tommorrowStartDate, $lt: tommorrowEndDate };
  }
  console.log("match", match);
  const meetings = await Meeting.find(match).sort("startDate").exec();
  return meetings;
};

const addMeetingHandler = async (
  context: GraphqlContextFunctionArgument,
  data: AddMeetingInput & { type: MeetingType }
) => {
  if (!context.auth) throw new Error("Unauthorized access");
  const host = context.auth._id;
  const event = await addMeeting(data.type, data);
  const meeting = await Meeting.create({ ...data, host });

  return meeting;
};

export default {
  getMeetingsHandler,
  addMeetingHandler,
};
