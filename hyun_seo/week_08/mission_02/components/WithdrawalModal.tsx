import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { deleteWithdrawal } from "../apis/auth";
import { LOCAL_STORAGE_KEY } from "../constants/key";

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WithdrawalModal = ({ isOpen, onClose }: WithdrawalModalProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: withdrawMutation, isPending } = useMutation({
    mutationFn: deleteWithdrawal,
    
    onSuccess: () => {
      localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
      sessionStorage.clear();

      queryClient.clear();

      alert("탈퇴가 완료되었습니다.");
      navigate("/login", {replace: true});
    },
    onError: (error) => {
      console.error("탈퇴 에러: ", error);
      alert("탈퇴 처리에 실패했습니다. 다시 시도해 주세요.")
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-9999 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="bg-[#1a1a1a] p-8 rounded-2xl border border-neutral-800 max-w-sm w-full shadow-2xl text-center"
      >
        <h2 className="text-xl font-bold text-white mb-3">정말 떠나시나요?</h2>
        <p className="text-neutral-400 mb-8 text-sm leading-relaxed">
          탈퇴 시 계정의 모든 정보가 삭제되며,<br />
          이 작업은 취소할 수 없습니다.
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl transition-all font-medium cursor-pointer"
          >
            취소
          </button>
          <button
            onClick={() => withdrawMutation()}
            disabled={isPending}
            className="flex-1 py-3 bg-[#E50914] hover:bg-[#b20710] text-white rounded-xl transition-all font-bold disabled:opacity-50 cursor-pointer"
          >
            {isPending ? "처리 중..." : "탈퇴하기"}
          </button>
        </div>
      </div>
    </div>
  );
};