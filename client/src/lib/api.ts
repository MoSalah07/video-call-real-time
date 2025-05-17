import type {
  IClientResponse,
  IFriendRequests,
  IFriendRequestsResponse,
  IFriends,
  IOnboardingDataInput,
  IUser,
} from "../interface";
import { axiosInstance } from "./axios";

export const completeOnboarding = async (
  userData: IOnboardingDataInput
): Promise<IUser> => {
  try {
    const res = await axiosInstance.post(`/auth/onboarding`, userData);
    return res.data.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

interface LoginData {
  email: string;
  password: string;
}

interface LoginDataFromDb {
  success: boolean;
  token: string;
  data: {
    fullName: string;
    email: string;
    profilePic: string;
  };
}

export const login = async (loginData: LoginData): Promise<LoginDataFromDb> => {
  try {
    const res = await axiosInstance.post(`/auth/login`, loginData);
    return res.data.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const logout = async (): Promise<IClientResponse<null>> => {
  try {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getUsersFriends = async (): Promise<
  IClientResponse<IFriends[]>
> => {
  try {
    const res = await axiosInstance.get("/user/friends");

    const {
      message,
      data: { success, friends },
    } = res.data;

    return {
      success,
      message,
      data: friends,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getRecommendedUsers = async (): Promise<
  IClientResponse<IUser[]>
> => {
  try {
    const res = await axiosInstance.get("/user");
    const {
      message,
      data: { success, recommendedUsers },
    } = res.data;

    return {
      success,
      message,
      data: recommendedUsers,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getOutgoingFriendReqs = async (): Promise<
  IClientResponse<IUser[]>
> => {
  try {
    const res = await axiosInstance.get(`/user/outgoing-friend-requests`);
    const {
      message,
      data: { success, outgoingRequests },
    } = res.data;

    return {
      success,
      message,
      data: outgoingRequests,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const sendFriendRequest = async (userId: string) => {
  try {
    const res = await axiosInstance.post(`/user/friend-request/${userId}`);
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getFriendRequests = async (): Promise<{
  success: boolean;
  message: string;
  acceptedRequests: IFriendRequests[];
  incomingRequests: IFriendRequests[];
}> => {
  try {
    const res = await axiosInstance.get(`/user/friend-requests`);

    const {
      message,
      data: { success, acceptedRequests, incomingRequests },
    } = res.data;

    return {
      success,
      message,
      acceptedRequests,
      incomingRequests,
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const acceptFriendRequests = async (
  requestId: string
): Promise<IFriendRequestsResponse> => {
  try {
    const res = await axiosInstance.put(
      `/user/friend-request/${requestId}/accept`
    );
    const {
      message,
      data: { success, outgoingRequests },
    } = res.data;

    return {
      success,
      message,
      data: outgoingRequests,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getStreamToken = async () => {
  try {
    const res = await axiosInstance.get(`/chat/token`);
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
