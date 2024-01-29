import { AddMeetingInput } from "../../generated/graphql";
import { GraphqlContextFunctionArgument } from "../../types";
import Meeting from "../../models/meeting";
import shortid from "shortid";
import { ObjectId } from "mongoose";
import path from "path";

type TFLyIoMeeting = AddMeetingInput & {
  host: string | ObjectId;
  meetingId: string;
  url: string;
};
export async function addFlyIOMeeting(
  context: GraphqlContextFunctionArgument,
  details: AddMeetingInput & {
    host: string | ObjectId;
  }
) {
  try {
    const event: TFLyIoMeeting = details as TFLyIoMeeting;
    const meetingId = shortid.generate();
    event.meetingId = meetingId;
    event.url = path.join("/", "flyio", meetingId);
    return await Meeting.create(event);
  } catch (error) {
    console.log("There was an error contacting the Calendar service: " + error);
    throw new Error("There was an error while creating event");
  }
}
