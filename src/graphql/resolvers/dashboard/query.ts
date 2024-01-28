import dashboard from "../../../controller/dashboard.controller";
import { GraphqlContextFunctionArgument } from "../../../types";
const dashboardQueries = {
  async getStats(_: any, args: any, context: GraphqlContextFunctionArgument) {
    return await dashboard.getStats(context);
  },
};

export default dashboardQueries;
