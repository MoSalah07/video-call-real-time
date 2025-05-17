import { Response, RequestHandler } from "express";
import { AuthenticatedRequest } from "../interfaces/auth.interface";
import User from "../models/User.model";
import FriendRequest from "../models/FriendRequest.model";
import { getCurrentUserId } from "../lib/globals.helper";
import { Types } from "mongoose";

const getRecommendedUsers: RequestHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const currentUserId = req.user?._id;
    const currentUser = req.user;

    if (!currentUserId) {
      res.status(401).json({ message: "Unauthorized user" });
      return;
    }

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } },
        { _id: { $nin: currentUser?.friends } },
        { isOnboarded: true },
      ],
    }).select("-password");

    res.status(200).json({
      message: "get Recommended Users",
      data: { success: true, recommendedUsers },
    });
    return;
  } catch (err) {
    console.error("Error In getRecommendedUsers: ", err);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

const getMyFriends: RequestHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const currentUserId = getCurrentUserId(req);
    if (!currentUserId) {
      res.status(401).json({ message: "Unauthorized user" });
      return;
    }
    const user = await User.findById(currentUserId)
      .select("friends")
      .populate(
        "friends",
        "fullName profilePic nativeLanguage learningLanguage"
      );

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json({
      message: "get My Friends",
      data: { success: true, friends: user?.friends },
    });
  } catch (err) {
    console.error("Error In getMyFriends: ", err);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

const sendFriendRequest: RequestHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const myId = getCurrentUserId(req);
    const recipientIdStr = req.params.id;

    // ✅ Validate recipient ID format
    if (!Types.ObjectId.isValid(recipientIdStr)) {
      res.status(400).json({ message: "Invalid recipient ID" });
      return;
    }

    const recipientId = new Types.ObjectId(recipientIdStr);
    // ✅ Prevent self-request
    if (myId.equals(recipientId)) {
      res
        .status(400)
        .json({ message: "You cannot send a friend request to yourself" });
      return;
    }
    // ✅ Check recipient exists and is not already a friend
    const recipient = await User.findById(recipientId).select("-password");
    if (!recipient) {
      res.status(404).json({ message: "Recipient not found" });
      return;
    }

    if (recipient.friends.includes(myId)) {
      res
        .status(400)
        .json({ message: "You are already friends with this user" });
      return;
    }
    // ✅ Check existing friend request (in any direction)
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });

    if (existingRequest) {
      res.status(400).json({
        message: "a friend request already exists between you and this user",
        data: { success: false },
      });
      return;
    }

    // ✅ Create friend request
    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });

    res.status(201).json({
      message: "Friend request sent successfully",
      data: { success: true, friendRequest },
    });
  } catch (err) {
    console.error("Error In sendFriendRequest: ", err);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

const acceptFriendRequest: RequestHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const myId = getCurrentUserId(req);
    const requestIdStr = req.params.id;
    // ✅ Validate request ID format
    if (!Types.ObjectId.isValid(requestIdStr)) {
      res.status(400).json({ message: "Invalid request ID" });
      return;
    }
    const recipientId = new Types.ObjectId(requestIdStr);

    const friendRequest = await FriendRequest.findById(recipientId);
    if (!friendRequest) {
      res.status(404).json({ message: "Friend request not found" });
      return;
    }

    if (!(friendRequest.recipient as Types.ObjectId).equals(myId)) {
      res.status(403).json({
        message: "You are not authorized to accept this friend request",
      });
      return;
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });

    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    res.status(200).json({
      message: "Friend request accepted successfully",
      data: { success: true, friendRequest },
    });
    return;
  } catch (err) {
    console.error("Error In acceptFriendRequest: ", err);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

const getFriendRequest: RequestHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const myId = getCurrentUserId(req);
    if (!myId) {
      res.status(401).json({ message: "Unauthorized user" });
      return;
    }

    const [incomingRequests, acceptedRequests] = await Promise.all([
      FriendRequest.find({
        recipient: myId,
        status: "pending",
      }).populate(
        "sender",
        "fullName profilePic nativeLanguage learningLanguage"
      ),

      FriendRequest.find({
        sender: myId,
        status: "accepted",
      }).populate("recipient", "fullName profilePic"),
    ]);

    res.status(200).json({
      message: "get Friend Request",
      data: { success: true, incomingRequests, acceptedRequests },
    });
  } catch (err) {
    console.error("Error In getFriendRequest: ", err);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

const getOutgoingFriendReqs: RequestHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const myId = getCurrentUserId(req);
    if (!myId) {
      res.status(401).json({ message: "Unauthorized user" });
      return;
    }

    const outgoingRequests = await FriendRequest.find({
      sender: myId,
      status: "pending",
    }).populate(
      "recipient",
      "fullName profilePic nativeLanguage learningLanguage"
    );

    res.status(200).json({
      message: "get Outgoing Friend Reqs",
      data: { success: true, outgoingRequests },
    });
    return;
  } catch (err) {
    console.error("Error In getOutgoingFriendReqs: ", err);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

export {
  getRecommendedUsers,
  getMyFriends,
  sendFriendRequest,
  acceptFriendRequest,
  getFriendRequest,
  getOutgoingFriendReqs,
};
