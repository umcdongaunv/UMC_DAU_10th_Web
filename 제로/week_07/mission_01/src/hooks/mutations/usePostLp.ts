import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postLp } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

interface RequestPostLpDto {
  title: string;
  content: string;
  thumbnail: string;
  tags: string[];
  published: boolean;
}

interface UsePostLpProps {
  onClose: () => void;
  resetForm: () => void;
}

const usePostLp = ({
  onClose,
  resetForm,
}: UsePostLpProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postLp,

    onSuccess: () => {
      // 1. 모달 닫기
      onClose();

      // 2. 입력값 초기화
      resetForm();

      // 3. LP 목록 자동 새로고침
      queryClient.invalidateQueries({
  queryKey: [QUERY_KEY.lps],
  refetchType: "all",
});
    },

    onError: (error) => {
      console.error(error);

      alert("LP 생성 실패");
    },
  });
};

export default usePostLp;