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
Object.defineProperty(exports, "__esModule", { value: true });
exports.addGoogleMeeting = exports.getGoogleMeetings = void 0;
const googleapis_1 = require("googleapis");
const uuid_1 = require("uuid");
const constants_1 = require("../../constants");
const auth = new googleapis_1.google.auth.JWT(constants_1.googleMeetClientEmail, constants_1.CREDENTIALS_PATH, constants_1.googleMeetPrivateKey, constants_1.SCOPES, constants_1.impersonatedUser);
const calendar = googleapis_1.google.calendar({
    version: "v3",
    auth,
});
function getGoogleMeetings() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield calendar.events.list({
            calendarId: constants_1.googleMeetCalenderId,
            timeMin: new Date().toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: "startTime",
        });
        const meetings = result.data.items;
        return meetings;
    });
}
exports.getGoogleMeetings = getGoogleMeetings;
function addGoogleMeeting(details) {
    return __awaiter(this, void 0, void 0, function* () {
        const attendees = details.users.map((user) => ({ email: user === null || user === void 0 ? void 0 : user.email }));
        const event = {
            summary: details.name,
            description: details.description || `Event for ${details.name}`,
            start: {
                dateTime: details.startDate,
            },
            end: {
                dateTime: details.endDate,
            },
            location: details.location,
            attendees,
            reminders: {
                useDefault: false,
                overrides: [
                    { method: "email", minutes: 24 * 60 },
                    { method: "popup", minutes: 10 },
                ],
            },
            conferenceData: {
                createRequest: {
                    requestId: (0, uuid_1.v4)(),
                    conferenceSolutionKey: {
                        type: "hangoutsMeet",
                    },
                },
            },
        };
        try {
            const response = yield calendar.events.insert({
                calendarId: constants_1.googleMeetCalenderId,
                requestBody: event,
                conferenceDataVersion: 1,
            });
            return response.data;
        }
        catch (error) {
            console.log("There was an error contacting the Calendar service: " + error);
            throw new Error("There was an error while creating event");
        }
    });
}
exports.addGoogleMeeting = addGoogleMeeting;
