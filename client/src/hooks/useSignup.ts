import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { ISignDataInput } from "../interface";
import { axiosInstance } from "../lib/axios";
import { useNavigate } from "react-router";

export default function useSignup() {
  const queryClient = useQueryClient();

  const navigator = useNavigate();

  const {
    mutate: signUpMutation,
    isPending,
    reset,
    error,
  } = useMutation({
    mutationFn: async (data: ISignDataInput): Promise<ISignDataInput> => {
      try {
        const res = await axiosInstance.post(`/auth/signup`, data);
        if (res.data.data.success) {
          reset();
          navigator("/");
        }
        return res.data;
      } catch (err) {
        console.log(`smothing went wrong: ${err}`);
        throw err;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }), // invalidate cache after login success
  });
  return { signUpMutation, isPending, error };
}
