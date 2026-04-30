// 데이터 로딩 중 사용자에게 시각적 피드백을 제공하는 스피너
export const LoadingSpinner = () => {
  return (
    <div
      className="size-12 animate-spin rounded-full border-6 border-t-transparent border-[#b2dab1]"
      role="status"
    >
      <span className="sr-only">로딩 중...</span>
    </div>
  );
};
