import { login } from "../lib/api";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useLogin() {
  const clientQuery = useQueryClient();
  const {
    mutate: loginMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      toast.success("User logged in successfully");
      clientQuery.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  return { loginMutation, isPending, error };
}
