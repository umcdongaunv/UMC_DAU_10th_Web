import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { patchMyInfo } from "../../apis/auth";

import { QUERY_KEY } from "../../constants/key";

const usePatchMyInfo = (
   lpid: number,
) => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: patchMyInfo,

    onSuccess: () => {
      queryClient.invalidateQueries({
         queryKey: [
         QUERY_KEY.lpComments,
         String(lpid),
         ]
         });

    },
  });
};

export default usePatchMyInfo;