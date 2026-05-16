import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteComment } from "../../apis/comment";

import { QUERY_KEY } from "../../constants/key";

interface DeleteCommentRequest {
  lpid: number;
  commentId: number;
}

const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      lpid,
      commentId,
    }: DeleteCommentRequest) =>
      deleteComment({
        lpid,
        commentId,
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

      alert("댓글 삭제 실패");
    },
  });
};

export default useDeleteComment;