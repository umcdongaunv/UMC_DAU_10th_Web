import { useMutation } from "@tanstack/react-query";

import { deleteWithdraw }
from "../../apis/auth";

const useWithdraw = (
  onSuccess?: () => void
) => {

  return useMutation({
    mutationFn: deleteWithdraw,

    onSuccess: () => {
      onSuccess?.();
    },

    onError: (error) => {
      console.error(error);

      alert("탈퇴 실패");
    },
  });
};

export default useWithdraw;