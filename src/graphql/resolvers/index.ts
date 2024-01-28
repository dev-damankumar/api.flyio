import { dashboardMutations, dashboardQueries } from "./dashboard";
import { userMutations, userQueries } from "./user";
import { meetingMutations, meetingQueries } from "./meeting";

const resolvers = {
  Query: {
    ...userQueries,
    ...dashboardQueries,
    ...meetingQueries,
  },
  Mutation: {
    ...userMutations,
    ...dashboardMutations,
    ...meetingMutations,
  },
};

export default resolvers;
