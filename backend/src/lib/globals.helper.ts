import { AuthenticatedRequest } from "../interfaces/auth.interface";
import { Types } from "mongoose";

export const getCurrentUserId = (req: AuthenticatedRequest): Types.ObjectId => {
  const currentUserId = req.user?._id;

  if (!currentUserId) {
    throw new Error("Unauthorized user");
  }

  return currentUserId;
};
