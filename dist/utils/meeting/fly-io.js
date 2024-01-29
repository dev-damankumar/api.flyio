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
exports.addFlyIOMeeting = void 0;
const meeting_1 = __importDefault(require("../../models/meeting"));
const shortid_1 = __importDefault(require("shortid"));
const path_1 = __importDefault(require("path"));
function addFlyIOMeeting(context, details) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const event = details;
            const meetingId = shortid_1.default.generate();
            event.meetingId = meetingId;
            event.url = path_1.default.join("/", "flyio", meetingId);
            return yield meeting_1.default.create(event);
        }
        catch (error) {
            console.log("There was an error contacting the Calendar service: " + error);
            throw new Error("There was an error while creating event");
        }
    });
}
exports.addFlyIOMeeting = addFlyIOMeeting;
