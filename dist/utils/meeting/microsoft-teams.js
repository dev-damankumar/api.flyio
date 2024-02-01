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
exports.addTeamsMeeting = void 0;
const microsoft_graph_client_1 = require("@microsoft/microsoft-graph-client");
const moment_1 = __importDefault(require("moment"));
const constants_1 = require("../../constants");
const meeting_1 = __importDefault(require("../../models/meeting"));
const clientId = constants_1.microsoftClientId;
const clientSecret = constants_1.microsoftSecretValue;
const tenantId = constants_1.microsoftTenentId;
const scopes = ["https://graph.microsoft.com/.default"];
function getAccessToken() {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
        const body = `client_id=${clientId}&scope=${scopes.join(" ")}&client_secret=${clientSecret}&grant_type=client_credentials`;
        const response = yield fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body,
        });
        const data = (yield response.json());
        return data.access_token;
    });
}
function addTeamsMeeting(_, details) {
    return __awaiter(this, void 0, void 0, function* () {
        const accessToken = yield getAccessToken();
        console.log("accessToken", accessToken);
        const attendees = details.users.map((user) => ({
            emailAddress: { address: user === null || user === void 0 ? void 0 : user.email },
            type: "required",
        }));
        console.log("attendees", attendees);
        const graphClient = microsoft_graph_client_1.Client.init({
            authProvider: (done) => {
                done(null, accessToken);
            },
        });
        const event = {
            subject: details.name,
            start: {
                dateTime: (0, moment_1.default)(details.startDate).toISOString(),
            },
            end: {
                dateTime: (0, moment_1.default)(details.endDate).toISOString(),
            },
            body: {
                content: (details === null || details === void 0 ? void 0 : details.description) || "Teams Meeting",
                contentType: "HTML",
            },
            isOnlineMeeting: true,
            onlineMeetingProvider: "teamsForBusiness",
            attendees: [
                {
                    emailAddress: {
                        address: details.host,
                    },
                    type: "required",
                },
            ],
        };
        try {
            const users = yield graphClient.api("/users").get();
            console.log("users", users);
            const meeting = yield meeting_1.default.create(Object.assign({}, details));
            return meeting;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    });
}
exports.addTeamsMeeting = addTeamsMeeting;
