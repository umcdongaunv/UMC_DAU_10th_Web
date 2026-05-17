import { useMutation, useQueryClient } from "@tanstack/react-query";

import { patchComment } from "../../apis/comment";

import { QUERY_KEY } from "../../constants/key";

interface PatchCommentRequest {
  lpid: number;
  commentId: number;
  content: string;
}

const usePatchComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      lpid,
      commentId,
      content,
    }: PatchCommentRequest) =>
      patchComment({
        lpid,
        commentId,
        content,
      }),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEY.lpComments,
          String(variables.lpid),
        ],
      });
    },

    onError: (error) => {
      console.error(error);

      alert("댓글 수정 실패");
    },
  });
};

export default usePatchComment;