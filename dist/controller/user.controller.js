"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("./../generated/graphql");
const user_1 = __importDefault(require("../models/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const constants_1 = require("../constants");
const email_1 = require("../utils/email");
const date_1 = require("../utils/date");
const forgotPassword_1 = __importDefault(require("../templates/forgotPassword"));
const getUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findOne({ _id: id });
    return user;
});
const me = (context) => __awaiter(void 0, void 0, void 0, function* () {
    if (!context.auth)
        throw new Error('Unauthorized Access');
    console.log('context.auth', context.auth);
    const user = yield user_1.default.findOne({ _id: context.auth._id });
    if (!user)
        return {
            message: 'Unauthenticated users are not allowed.',
            status: 404,
            type: graphql_1.ResponseType.Error,
        };
    console.log('user', user);
    return user;
});
const getUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_1.default.find({});
    return users;
});
const createNewUser = (args) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = args.user;
        const userExists = yield user_1.default.findOne({
            email: newUser.email,
        });
        if (userExists) {
            throw new Error('user already exists');
        }
        const hasedPassword = yield bcrypt_1.default.hash(args.user.password, 10);
        newUser.password = hasedPassword;
        newUser.authType = graphql_1.AuthType.Credentails;
        const user = yield user_1.default.create(newUser);
        user.password = null;
        return user;
    }
    catch (error) {
        if (error instanceof Error) {
            console.log('Error on: (createNewUser) ', error.message);
            throw new Error(error.message);
        }
        throw new Error('user already exists');
    }
});
const updateAnUser = (args, context) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!context.auth)
            throw new Error('Unauthorized Access');
        const newUser = args.user;
        const user = (yield user_1.default.findOneAndUpdate({ email: context.auth.email }, newUser));
        if (!user)
            throw new Error("token malfunction detected! unauthorized person can't access this resource");
        user.password = null;
        const updatedUser = Object.assign(Object.assign({}, user), newUser);
        return updatedUser;
    }
    catch (error) {
        if (error instanceof Error) {
            console.log('Error on: (updateAnUser) ', error.message);
            throw new Error(error.message);
        }
        throw new Error('user counld not be updated!!');
    }
});
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userExists = (yield user_1.default.findOne({
            email,
            authType: graphql_1.AuthType.Credentails,
        }));
        if (!userExists) {
            throw new Error('user does not exists');
        }
        const isValidPassword = yield bcrypt_1.default.compare(password, userExists.password);
        if (!isValidPassword) {
            throw new Error('password is not correct!');
        }
        const token = yield jsonwebtoken_1.default.sign({ email: userExists.email, _id: userExists.id }, constants_1.jwtSecret, { expiresIn: '24h' });
        const user = Object.assign(Object.assign({}, userExists._doc), { token });
        return user;
    }
    catch (error) {
        if (error instanceof Error) {
            console.log('error', error.message);
            throw new Error(error.message);
        }
        throw new Error('user does not exists');
    }
});
const forgotPassword = (args) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const user = yield user_1.default.findOne({ email: args.email });
    if (!user)
        throw new Error('No user found with this email');
    try {
        if (((_b = (_a = user === null || user === void 0 ? void 0 : user.security) === null || _a === void 0 ? void 0 : _a.resetPassword) === null || _b === void 0 ? void 0 : _b.token) &&
            ((_d = (_c = user === null || user === void 0 ? void 0 : user.security) === null || _c === void 0 ? void 0 : _c.resetPassword) === null || _d === void 0 ? void 0 : _d.expiry)) {
            const tokenExpiryDate = new Date((_f = (_e = user === null || user === void 0 ? void 0 : user.security) === null || _e === void 0 ? void 0 : _e.resetPassword) === null || _f === void 0 ? void 0 : _f.expiry);
            const now = new Date();
            if (now < tokenExpiryDate) {
                return {
                    message: 'We have already sent a link to your email to reset a password',
                    status: 200,
                    type: 'success',
                };
            }
        }
        const token = yield jsonwebtoken_1.default.sign({ email: args.email }, constants_1.jwtSecret, {
            expiresIn: '5m',
        });
        if (!user.security) {
            user.security = { resetPassword: {}, verification: {} };
        }
        user.security.resetPassword = user.security.resetPassword || {};
        const date = new Date(Date.now() + (0, date_1.minutesToMillsecond)(5));
        user.security.resetPassword.token = token;
        user.security.resetPassword.expiry = date;
        yield user.save();
        const resetPasswordLink = `${constants_1.siteurl}/auth/reset-password?token=${token}`;
        yield (0, email_1.send)({
            to: args.email,
            subject: 'Forgot Password',
            html: (0, forgotPassword_1.default)(user.username, resetPasswordLink),
        });
        return {
            message: 'We have successfully send a link to your email to reset a password',
            status: 200,
            type: 'success',
        };
    }
    catch (error) {
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
});
const resetPassword = (context, args) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findOne({
        'security.resetPassword.token': args.token,
    });
    if (!user)
        return {
            message: 'Your reset link has been expired!',
            status: 404,
            type: 'error',
        };
    try {
        user.security.resetPassword.token = null;
        user.security.resetPassword.expiry = null;
        const hasedPassword = yield bcrypt_1.default.hash(args.password, 10);
        user.password = hasedPassword;
        yield user.save();
        return {
            message: 'We have successfully reset your password',
            status: 200,
            type: 'success',
        };
    }
    catch (error) {
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
});
const integration = {
    'google-meet': 'google',
    'microsoft-teams': 'microsoft',
    zoom: 'zoom',
};
const authorizeIntegrationCalender = (context, args) => __awaiter(void 0, void 0, void 0, function* () {
    if (!context.auth)
        throw new Error('Unauthorized Access');
    if (!(args.type in integration))
        throw new Error('Invalid integration.');
    const auth = context.auth;
    const user = yield user_1.default.findOne({ _id: auth._id });
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
        yield user.save();
        return {
            message: 'You have successfully integarted your account with google',
            status: 200,
            type: 'success',
        };
    }
    catch (error) {
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
});
exports.default = {
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
