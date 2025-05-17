import mongoose, { Model, Schema } from "mongoose";
import { IFriendRequest } from "../interfaces/user.interface";

const FriendRequestSchema: Schema<IFriendRequest> = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const FriendRequest: Model<IFriendRequest> =
  mongoose.models.FriendsRequest ||
  mongoose.model<IFriendRequest>("FriendRequest", FriendRequestSchema);

export default FriendRequest;
