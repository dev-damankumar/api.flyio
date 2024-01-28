import { GraphqlContextFunctionArgument } from "../types";

const getStats = (context: GraphqlContextFunctionArgument) => {
  if (!context.auth) throw new Error("Unauthorized access");
  return {
    stats: 10,
  };
};

const setStats = (context: GraphqlContextFunctionArgument) => {
  console.log("set Stat context", context.auth);
  if (!context.auth) throw new Error("Unauthorized access");
  return {
    stats: 10,
  };
};

export default {
  getStats,
  setStats,
};
