import { useMutation }
from "@tanstack/react-query";

import { postLogout }
from "../../apis/auth";

const useLogout = (
  onSuccess?: () => void
) => {

  return useMutation({
    mutationFn: postLogout,

    onSuccess: () => {
      onSuccess?.();
    },

    onError: (error) => {
      console.error(error);

      alert("로그아웃 실패");
    },
  });
};

export default useLogout;