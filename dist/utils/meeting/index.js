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
exports.cancelMeeting = exports.addMeeting = void 0;
const google_meet_1 = require("./google-meet");
const fly_io_1 = require("./fly-io");
const microsoft_teams_1 = require("./microsoft-teams");
const zoom_1 = require("./zoom");
const meetingTypes = {
    'google-meet': {
        add: google_meet_1.addGoogleMeeting,
        cancel: google_meet_1.cancelGoogleMeeting,
    },
    'microsoft-teams': {
        add: microsoft_teams_1.addTeamsMeeting,
        cancel: microsoft_teams_1.cancelMicrosoftMeeting,
    },
    zoom: {
        add: zoom_1.addZoomMeeting,
        cancel: zoom_1.cancelZoomMeeting,
    },
    'fly-io': {
        add: fly_io_1.addFlyIOMeeting,
        cancel: fly_io_1.cancelFlyIOMeeting,
    },
};
function addMeeting(context, type, details) {
    return __awaiter(this, void 0, void 0, function* () {
        const Meet = meetingTypes[type];
        const data = yield Meet.add(context, details);
        return data;
    });
}
exports.addMeeting = addMeeting;
function cancelMeeting(context, type, meetingId) {
    return __awaiter(this, void 0, void 0, function* () {
        const Meet = meetingTypes[type];
        const data = yield Meet.cancel(context, meetingId);
        return data;
    });
}
exports.cancelMeeting = cancelMeeting;
