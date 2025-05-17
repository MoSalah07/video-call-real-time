import { Types } from "mongoose";

export interface IFriendRequest {
  _id?: Types.ObjectId;
  sender: Types.ObjectId | string;
  recipient: Types.ObjectId | string;
  status: "pending" | "accepted";
  createdAt?: Date;
  updatedAt?: Date;
}
