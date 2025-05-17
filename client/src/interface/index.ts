export interface IUser {
  _id: string;
  fullName: string;
  email: string;
  bio: string;
  country: string;
  learningLanguage: string;
  nativeLanguage: string;
  profilePic: string;
  isOnboarded: boolean;
  friends: string[]; // أو لو هتخزن بيانات الأصدقاء الكاملة، عدل ده
  createdAt?: string; // أو Date حسب ما ترجّع الـ backend
  updatedAt?: string; // أو Date
}

export interface IOnboardingDataInput {
  fullName: string;
  bio: string;
  nativeLanguage: string;
  learningLanguage: string;
  country: string;
  profilePic: string;
}

export interface ISignDataInput {
  fullName: string;
  email: string;
  password: string;
}

//================================================= USers Friends ===========================

export interface IFriends {
  _id?: string | undefined;
  fullName: string;
  profilePic: string;
  nativeLanguage: string;
  learningLanguage: string;
}

export interface IClientResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface IFriendRequest {
  _id: string;
  createdAt: string;
  updatedAt: string;
  status: "pending" | "accepted";
  sender: string;
  recipient: {
    _id: string;
    fullName: string;
    learningLanguage: string;
    nativeLanguage: string;
    profilePic?: string;
  };
}

export interface IUserSnippet {
  _id: string;
  fullName: string;
  profilePic: string;
  nativeLanguage?: string;
  learningLanguage?: string;
}

export interface IFriendRequests {
  _id: string;
  createdAt: string;
  updatedAt: string;
  status: "pending" | "accepted";
  sender: IUserSnippet;
  recipient: IUserSnippet;
}

export interface IFriendRequestsResponse {
  success: boolean;
  message: string;
  data: {
    incomingRequests: IFriendRequests[];
    acceptedRequests: IFriendRequests[];
  };
}
