import { useMutation } from "@tanstack/react-query";
import { deleteLike } from "../../apis/lp";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";
import type { ResponseLpDto } from "../../types/lp";
import type { ResponseMyInfoDto } from "../../types/auth";

function useDeleteLike() {
  return useMutation({
    mutationFn: deleteLike,
    // onMutate -> API 요청 이전에 호출되는 친구
    // UI에 바로 변경을 보여주기 위해 Cache 업데이트
    onMutate: async(lp) => {
      // 1. 이 게시글에 관련된 쿼리를 취소 (캐시된 데이터를 새로 불러오는 요청 취소)
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEY.lps, lp.lpId],
      });

      // 2. 현재 게시글의 데이터를 캐시에서 가져와
      const previousLpPost = queryClient.getQueryData<ResponseLpDto>([QUERY_KEY.lps, lp.lpId]);

      // 게시글에 저장된 좋아요 목록에서 현재 내가 누른 좋아요 위치를 찾아야 함
      const me = queryClient.getQueryData<ResponseMyInfoDto>([QUERY_KEY.myInfo]);

      const userId = Number(me?.data.id);

      if (previousLpPost && previousLpPost.data) {
        const likedIndex = previousLpPost?.data.likes.findIndex((like) => like.userId === userId) ?? -1;

        let newLikes = [...previousLpPost.data.likes];

        if (likedIndex >= 0) {
          newLikes.splice(likedIndex, 1);
        }

        const newLpPost: ResponseLpDto = {
          ...previousLpPost,
          data: {
            ...previousLpPost.data,
            likes: newLikes
          },
        };
        queryClient.setQueryData([QUERY_KEY.lps, lp.lpId], newLpPost);
      }

      return {previousLpPost};
    },
    onError: (err, newLp, context) => {
      console.log(err, newLp);
      queryClient.setQueryData(
        [QUERY_KEY.lps, newLp.lpId],
        context?.previousLpPost?.data.id,
      );
    },

    // onSettled는 API 요청이 끝난 후 (성공하든 싪패하든 실행)
    onSettled: async(_, __, variables) => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lps, variables.lpId],
      })
    }
  });
}

export default useDeleteLike;