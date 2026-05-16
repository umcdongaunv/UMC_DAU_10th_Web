import { useMutation } from "@tanstack/react-query";
import { postSignin } from "../../apis/auth";

import type {RequestSigninDto} from "../../types/auth";


interface LoginCallbacks {
  onSuccess?: (data: any) => void;
}

const useLogin = (
  callbacks?: LoginCallbacks
) => {

  return useMutation({
    mutationFn: (
      signinData: RequestSigninDto
    ) => postSignin(signinData),

    onSuccess: (data) => {
      callbacks?.onSuccess?.(data);
    },

    onError: (error) => {
      console.error(error);

      alert("로그인 실패");
    },
  });
};

export default useLogin;