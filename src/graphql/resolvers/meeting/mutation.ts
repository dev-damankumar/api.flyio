import { AddMeetingInput } from "./../../../generated/graphql";
import meeting from "../../../controller/meeting.controller";
import { GraphqlContextFunctionArgument, MeetingType } from "../../../types";

const meetingMutations = {
  async addMeeting(
    _: any,
    args: { meeting: AddMeetingInput & { type: MeetingType } },
    context: GraphqlContextFunctionArgument
  ) {
    return await meeting.addMeetingHandler(context, args.meeting);
  },
};

export default meetingMutations;
