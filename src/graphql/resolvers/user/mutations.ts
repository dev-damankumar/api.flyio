import { BaseContext, ContextFunction } from "@apollo/server";
import user from "../../../controller/user.controller";
import { UserCreateInput, UserUpdateInput } from "../../../generated/graphql";
import { ExpressContextFunctionArgument } from "@apollo/server/dist/esm/express4";
import { GraphqlContextFunctionArgument } from "../../../types";

const userMutations = {
  createUser: async (_: any, args: { user: UserCreateInput }) => {
    return await user.createNewUser(args);
  },
  updateUser: async (
    _: any,
    args: { user: UserUpdateInput },
    context: GraphqlContextFunctionArgument
  ) => {
    return await user.updateAnUser(args, context);
  },
  forgotPassword: async (_: any, args: { email: string }) => {
    return await user.forgotPassword(args);
  },
  resetPassword: async (
    _: any,
    args: { token: string; password: string },
    context: GraphqlContextFunctionArgument
  ) => {
    return await user.resetPassword(context, args);
  },
};

export default userMutations;
