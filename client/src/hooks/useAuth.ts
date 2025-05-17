import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import type { IUser } from "../interface";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface AuthUserResponse {
  user: IUser;
}

interface UseAuthResult {
  authUser: IUser | null;
  isLoading: boolean;
  error: Error | null;
}

export const useAuth = (): UseAuthResult => {
  const {
    data,
    isPending: isLoading,
    error,
  } = useQuery<ApiResponse<AuthUserResponse> | null, Error>({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get<ApiResponse<AuthUserResponse>>(
          "/auth/me"
        );
        return res.data;
      } catch (err) {
        console.log(err);
        return null;
      }
    },
    retry: false,
  });

  const authUser = data?.data.user ?? null;

  return { authUser, isLoading, error };
};
