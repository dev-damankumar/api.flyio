"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dashboard_1 = require("./dashboard");
const user_1 = require("./user");
const meeting_1 = require("./meeting");
const resolvers = {
    Query: Object.assign(Object.assign(Object.assign({}, user_1.userQueries), dashboard_1.dashboardQueries), meeting_1.meetingQueries),
    Mutation: Object.assign(Object.assign(Object.assign({}, user_1.userMutations), dashboard_1.dashboardMutations), meeting_1.meetingMutations),
};
exports.default = resolvers;
