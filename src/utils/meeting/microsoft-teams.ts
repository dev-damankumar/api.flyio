import { ObjectId } from "mongoose";
import { AddMeetingInput } from "../../generated/graphql";
import { GraphqlContextFunctionArgument, MeetingType } from "../../types";
import { Client } from "@microsoft/microsoft-graph-client";
import User from "../../models/user";
import moment from "moment";
import { GQLErrorCodes } from "../../constants";
import Meeting from "../../models/meeting";
import { GQLError } from "..";

export async function addTeamsMeeting(
  context: GraphqlContextFunctionArgument,
  details: AddMeetingInput & { type: MeetingType; host: string | ObjectId }
) {
  if (!context.auth) throw new Error("Unauthorized access");
  const userId = context.auth._id;
  const user = await User.findOne({
    _id: userId,
  });
  if (!user) throw new Error("Unauthorized access");
  const accessToken = user.integration?.microsoft?.accessToken;
  if (!accessToken)
    throw new GQLError("Missing access token", GQLErrorCodes.NO_ACCESS_TOKEN);
  const attendees = details.users.map((user) => ({
    emailAddress: { address: user?.email },
    type: "required",
  }));
  const client = Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    },
  });

  const event = {
    subject: details.name,
    start: {
      dateTime: moment(details.startDate).toISOString(),
      timeZone: details.location || "Asia/Calcutta",
    },
    end: {
      dateTime: moment(details.endDate).toISOString(),
      timeZone: details.location || "Asia/Calcutta",
    },
    body: {
      content: details?.description || "Teams Meeting",
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
      ...attendees,
    ],
  };

  try {
    const data = await client.api("/me/events").post({ ...event });
    console.log(data);
    const meeting = await Meeting.create({ ...details });
    return meeting;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
