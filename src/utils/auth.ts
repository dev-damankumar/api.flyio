import jwt from "jsonwebtoken";
import { Request } from "express";
import { jwtSecret } from "../constants";
import { JWTPayload } from "../types";
export const getTokenFromHeaders = (req: Request) => {
  const authorization = req.headers.authorization || "";
  return authorization?.split(" ")[1]?.trim();
};

export const decodeJWT = async (token: string) => {
  try {
    return (await jwt.verify(token, jwtSecret)) as JWTPayload;
  } catch (error) {
    if (error instanceof Error)
      console.log("Error decoding Jwt", error.message);
    return null;
  }
};

export const sendError = (
  message: string = "Unhandled Error has occured!!!",
  status: number = 500
) => {
  return {
    message,
    status,
  };
};
