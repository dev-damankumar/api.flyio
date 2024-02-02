import {
  AuthType,
  LoggedInUser,
  Response,
  ResponseType,
  User,
  UserCreateInput,
  UserUpdateInput,
} from './../generated/graphql';
import UserModel from '../models/user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { jwtSecret, siteurl } from '../constants';
import { send } from '../utils/email';
import { minutesToMillsecond } from '../utils/date';
import forgotPasswordTemplate from '../templates/forgotPassword';
import { ExpressContextFunctionArgument } from '@apollo/server/dist/esm/express4';
import { GraphqlContextFunctionArgument } from '../types';

const getUser = async (id: string): Promise<User | null> => {
  const user = await UserModel.findOne<User>({ _id: id });
  return user;
};

const me = async (
  context: GraphqlContextFunctionArgument
): Promise<User | Response> => {
  if (!context.auth) throw new Error('Unauthorized Access');
  console.log('context.auth', context.auth);
  const user = await UserModel.findOne<User>({ _id: context.auth._id });
  if (!user)
    return {
      message: 'Unauthenticated users are not allowed.',
      status: 404,
      type: ResponseType.Error,
    };

  console.log('user', user);

  return user as User;
};

const getUsers = async (): Promise<User[] | []> => {
  const users = await UserModel.find<User>({});
  return users;
};

const createNewUser = async (args: { user: UserCreateInput }) => {
  try {
    const newUser: User = args.user as User;
    const userExists = await UserModel.findOne({
      email: newUser.email,
    });
    if (userExists) {
      throw new Error('user already exists');
    }
    const hasedPassword = await bcrypt.hash(args.user.password, 10);
    newUser.password = hasedPassword;
    newUser.authType = AuthType.Credentails;
    const user = await UserModel.create<User>(newUser);
    user.password = null;
    return user;
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error on: (createNewUser) ', error.message);
      throw new Error(error.message);
    }
    throw new Error('user already exists');
  }
};
const updateAnUser = async (
  args: { user: UserUpdateInput },
  context: GraphqlContextFunctionArgument
): Promise<User> => {
  try {
    if (!context.auth) throw new Error('Unauthorized Access');
    const newUser = args.user;
    const user = (await UserModel.findOneAndUpdate(
      { email: context.auth.email },
      newUser
    )) as User;
    if (!user)
      throw new Error(
        "token malfunction detected! unauthorized person can't access this resource"
      );
    user.password = null;
    const updatedUser = {
      ...user,
      ...newUser,
    } as User;
    return updatedUser;
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error on: (updateAnUser) ', error.message);
      throw new Error(error.message);
    }
    throw new Error('user counld not be updated!!');
  }
};

const loginUser = async (
  email: string,
  password: string
): Promise<LoggedInUser> => {
  try {
    const userExists: User & { _doc: User } = (await UserModel.findOne({
      email,
      authType: AuthType.Credentails,
    })) as User & { _doc: User };
    if (!userExists) {
      throw new Error('user does not exists');
    }

    const isValidPassword = await bcrypt.compare(
      password,
      userExists.password!
    );
    if (!isValidPassword) {
      throw new Error('password is not correct!');
    }

    const token = await jwt.sign(
      { email: userExists.email, _id: userExists.id },
      jwtSecret,
      { expiresIn: '24h' }
    );
    const user = {
      ...userExists._doc,
      token,
    };

    return user as LoggedInUser;
  } catch (error) {
    if (error instanceof Error) {
      console.log('error', error.message);
      throw new Error(error.message);
    }
    throw new Error('user does not exists');
  }
};

const forgotPassword = async (args: { email: string }) => {
  const user = await UserModel.findOne({ email: args.email });
  if (!user) throw new Error('No user found with this email');
  try {
    if (
      user?.security?.resetPassword?.token &&
      user?.security?.resetPassword?.expiry
    ) {
      const tokenExpiryDate = new Date(user?.security?.resetPassword?.expiry);
      const now = new Date();
      if (now < tokenExpiryDate) {
        return {
          message:
            'We have already sent a link to your email to reset a password',
          status: 200,
          type: 'success',
        };
      }
    }
    const token = await jwt.sign({ email: args.email }, jwtSecret, {
      expiresIn: '5m',
    });

    if (!user.security) {
      user.security = { resetPassword: {}, verification: {} };
    }
    user.security.resetPassword = user.security.resetPassword || {};
    const date = new Date(Date.now() + minutesToMillsecond(5));

    user.security.resetPassword.token = token;
    user.security.resetPassword.expiry = date;

    await user.save();
    const resetPasswordLink = `${siteurl}/auth/reset-password?token=${token}`;
    await send({
      to: args.email,
      subject: 'Forgot Password',
      html: forgotPasswordTemplate(user.username, resetPasswordLink),
    });
    return {
      message:
        'We have successfully send a link to your email to reset a password',
      status: 200,
      type: 'success',
    };
  } catch (error) {
    if (error instanceof Error)
      return {
        message: error.message,
        status: 200,
        type: 'error',
      };
    return {
      message: 'Error sending email to the mail',
      status: 200,
      type: 'error',
    };
  }
};

const resetPassword = async (
  context: ExpressContextFunctionArgument,
  args: { token: string; password: string }
) => {
  const user = await UserModel.findOne({
    'security.resetPassword.token': args.token,
  });
  if (!user)
    return {
      message: 'Your reset link has been expired!',
      status: 404,
      type: 'error',
    };

  try {
    user.security!.resetPassword!.token = null;
    user.security!.resetPassword!.expiry = null;
    const hasedPassword = await bcrypt.hash(args.password, 10);
    user.password = hasedPassword;
    await user.save();
    return {
      message: 'We have successfully reset your password',
      status: 200,
      type: 'success',
    };
  } catch (error) {
    if (error instanceof Error)
      return {
        message: error.message,
        status: 200,
        type: 'error',
      };
    return {
      message: 'Error while reseting your password',
      status: 200,
      type: 'error',
    };
  }
};

type TIntegartion = {
  'google-meet': 'google';
  'microsoft-teams': 'microsoft';
  zoom: 'zoom';
};
const integration: TIntegartion = {
  'google-meet': 'google',
  'microsoft-teams': 'microsoft',
  zoom: 'zoom',
};

const authorizeIntegrationCalender = async (
  context: GraphqlContextFunctionArgument,
  args: {
    type: 'zoom' | 'google-meet' | 'microsoft-teams';
    accessToken: string;
    refreshToken: string;
  }
) => {
  if (!context.auth) throw new Error('Unauthorized Access');
  if (!(args.type in integration)) throw new Error('Invalid integration.');
  const auth = context.auth;

  const user = await UserModel.findOne({ _id: auth._id });
  if (!user)
    return {
      message: 'Unauthenticated users are not allowed.',
      status: 404,
      type: 'error',
    };

  try {
    if (!user.integration) {
      user.integration = {};
    }
    const integrationType = integration[args.type];

    user.integration[integrationType] = {
      accessToken: args.accessToken,
      refreshToken: args.refreshToken,
      authorized: true,
    };
    await user.save();
    return {
      message: 'You have successfully integarted your account with google',
      status: 200,
      type: 'success',
    };
  } catch (error) {
    if (error instanceof Error)
      return {
        message: error.message,
        status: 200,
        type: 'error',
      };
    return {
      message: 'Error while reseting your password',
      status: 200,
      type: 'error',
    };
  }
};

export default {
  me,
  getUser,
  getUsers,
  createNewUser,
  updateAnUser,
  loginUser,
  forgotPassword,
  resetPassword,
  authorizeIntegrationCalender,
};
