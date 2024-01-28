import user from "../../../controller/user.controller";
import { LoggedInUser } from "../../../generated/graphql";

const userQueries = {
  users: async () => {
    return await user.getUsers();
  },
  user: async (_: any, args: { id: string }) => {
    return await user.getUser(args.id);
  },
  login: async (
    _: any,
    args: { email: string; password: string }
  ): Promise<LoggedInUser> => {
    return await user.loginUser(args.email, args.password);
  },
};

export default userQueries;
