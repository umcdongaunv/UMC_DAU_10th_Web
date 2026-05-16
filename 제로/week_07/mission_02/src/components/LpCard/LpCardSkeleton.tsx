const LpCardSkeleton = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* 이미지 자리 */}
      <div className="w-full h-80 bg-gray-800 animate-pulse" />

      {/* Overlay 자리 */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/60 to-transparent">
        {/* 제목 */}
        <div className="h-5 w-3/4 bg-gray-700 rounded animate-pulse mb-2" />
        {/* 날짜 */}
        <div className="h-3 w-1/2 bg-gray-700 rounded animate-pulse mb-2" />
        {/* 좋아요 */}
        <div className="h-3 w-1/4 bg-gray-700 rounded animate-pulse" />
      </div>
    </div>
  );
};

export default LpCardSkeleton;