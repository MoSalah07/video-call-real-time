import { Response, RequestHandler } from "express";
import { AuthenticatedRequest } from "../interfaces/auth.interface";
import { generateStreamToken } from "../lib/stream";
import { getCurrentUserId } from "../lib/globals.helper";

const getStreamToken: RequestHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const myId = getCurrentUserId(req);
    if (!myId) {
      res.status(401).json({ message: "Unauthorized user" });
      return;
    }
    const token = generateStreamToken(myId.toString());

    if (!token) {
      res.status(400).json({ message: "Failed to generate stream token" });
      return;
    }

    res.status(200).json({ token });
    return;
  } catch (err) {
    console.error("Error In getStreamToken: ", err);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

export { getStreamToken };
