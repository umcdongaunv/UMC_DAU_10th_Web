import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { patchLp } from "../../apis/lp";

import { QUERY_KEY }
from "../../constants/key";

interface PatchLpRequest {
  lpid: number;
  title: string;
  content: string;
}

const usePatchLp = (
  lpid: number
) => {

  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      lpid,
      title,
      content,
    }: PatchLpRequest) =>
      patchLp({
        lpid,
        title,
        content,
      }),

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEY.lpDetail,
          String(lpid),
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lp],
      });
    },

    onError: (error) => {
      console.error(error);

      alert("LP 수정 실패");
    },
  });
};

export default usePatchLp;