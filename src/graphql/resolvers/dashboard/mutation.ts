import dashboard from "../../../controller/dashboard.controller";
import { GraphqlContextFunctionArgument } from "../../../types";

const dashboardMutations = {
  async setStats(_: any, args: any, context: GraphqlContextFunctionArgument) {
    return await dashboard.setStats(context);
  },
};

export default dashboardMutations;
