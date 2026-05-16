import { useMutation } from "@tanstack/react-query";
import { postLike } from "../../apis/lp";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";

function usePostLike() {
  return useMutation({
    mutationFn: postLike,

    onSuccess: async (_, variables) => {
      await queryClient.refetchQueries({
        queryKey: [QUERY_KEY.lp, String(variables.lpid)],
      });
    },
  });
}

export default usePostLike;