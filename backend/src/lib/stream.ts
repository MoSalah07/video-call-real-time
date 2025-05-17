import { StreamChat, UserResponse } from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY!;
const apiSecret = process.env.STREAM_API_SECRET!;

if (!apiKey || !apiSecret) {
  console.log("STREAM_API_KEY or STREAM_API_SECRET is not defined");
  throw new Error("STREAM_API_KEY or STREAM_API_SECRET is not defined");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData: UserResponse) => {
  try {
    await streamClient.upsertUsers([userData]);
    return userData;
  } catch (err) {
    console.error(`Error in upserting Stream User: ${err}`);
  }
};

export const generateStreamToken = (userId: string): string | undefined => {
  try {
    return streamClient.createToken(userId);
  } catch (err) {
    console.error(`Error in generating Stream Token: ${err}`);
    return;
  }
};
