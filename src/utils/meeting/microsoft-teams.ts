import { ObjectId } from "mongoose";
import { AddMeetingInput } from "../../generated/graphql";
import { MeetingType } from "../../types";
import { Client } from "@microsoft/microsoft-graph-client";
import msal from "@azure/msal-node";

import moment from "moment";
import {
  microsoftClientId,
  microsoftSecretValue,
  microsoftTenentId,
} from "../../constants";
import Meeting from "../../models/meeting";

const clientId = microsoftClientId;
const clientSecret = microsoftSecretValue;
const tenantId = microsoftTenentId;
const scopes = ["https://graph.microsoft.com/.default"];

async function getAccessToken() {
  const url = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  const body = `client_id=${clientId}&scope=${scopes.join(
    " "
  )}&client_secret=${clientSecret}&grant_type=client_credentials`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const data = (await response.json()) as { access_token: string };
  return data.access_token;
}
export async function addTeamsMeeting(
  _: any,
  details: AddMeetingInput & { type: MeetingType; host: string | ObjectId }
) {
  const accessToken = await getAccessToken();
  console.log("accessToken", accessToken);
  const attendees = details.users.map((user) => ({
    emailAddress: { address: user?.email },
    type: "required",
  }));
  console.log("attendees", attendees);
  const graphClient = Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    },
  });

  const event = {
    subject: details.name,
    start: {
      dateTime: moment(details.startDate).toISOString(),
    },
    end: {
      dateTime: moment(details.endDate).toISOString(),
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
    ],
  };

  try {
    const users = await graphClient.api("/users").get();
    console.log("users", users);
    const meeting = await Meeting.create({ ...details });
    return meeting;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
