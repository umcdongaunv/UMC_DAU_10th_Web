import { useMutation } from "@tanstack/react-query";
import { deleteLike } from "../../apis/lp";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";

function useDeleteLike() {
  return useMutation({
    mutationFn: deleteLike,

    onSuccess: async (_, variables) => {
      await queryClient.refetchQueries({
        queryKey: [QUERY_KEY.lp, String(variables.lpid)],
      });
    },
  });
}

export default useDeleteLike;