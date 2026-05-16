import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { deleteLp }
from "../../apis/lp";

import { QUERY_KEY }
from "../../constants/key";

const useDeleteLp = (
  onSuccess?: () => void
) => {

  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      lpid: number
    ) => deleteLp(lpid),

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lp],
      });

      onSuccess?.();
    },

    onError: (error) => {
      console.error(error);

      alert("LP 삭제 실패");
    },
  });
};

export default useDeleteLp;