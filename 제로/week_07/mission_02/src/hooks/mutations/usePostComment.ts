import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { postComment } from "../../apis/comment";

import { QUERY_KEY } from "../../constants/key";

const usePostComment = (
  lpid: number,
  reset: () => void
) => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: postComment,

    onSuccess: () => {
      reset();

      queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEY.lpComments,
          String(lpid),
        ],
        refetchType: "all",
      });
    },
  });
};

export default usePostComment;