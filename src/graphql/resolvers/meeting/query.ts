import meeting from "../../../controller/meeting.controller";
import { IMeetingFilter } from "../../../generated/graphql";
import { GraphqlContextFunctionArgument } from "../../../types";

const meetingQueries = {
  async getMeetings(
    _: any,
    args: { filter: IMeetingFilter },
    context: GraphqlContextFunctionArgument
  ) {
    return await meeting.getMeetingsHandler(context, args.filter);
  },
};

export default meetingQueries;
