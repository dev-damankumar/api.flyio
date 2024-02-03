import { AddMeetingInput } from './../../../generated/graphql';
import meeting from '../../../controller/meeting.controller';
import { GraphqlContextFunctionArgument, MeetingType } from '../../../types';

const meetingMutations = {
  async addMeeting(
    _: any,
    args: { meeting: AddMeetingInput & { type: MeetingType } },
    context: GraphqlContextFunctionArgument
  ) {
    return await meeting.addMeetingHandler(context, args.meeting);
  },
  async cancelMeeting(
    _: any,
    args: { type: MeetingType; meetingId: string },
    context: GraphqlContextFunctionArgument
  ) {
    return await meeting.cancelMeetingHandler(context, args);
  },
};

export default meetingMutations;
