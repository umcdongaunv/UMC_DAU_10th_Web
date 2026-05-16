const CommentSkeleton = () => {
  return (
    <div className="flex gap-3 py-4 border-b border-gray-700">
      {/* 아바타 */}
      <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse shrink-0" />
      <div className="flex flex-col gap-2 flex-1">
        {/* 이름 */}
        <div className="h-3 w-1/4 bg-gray-700 rounded animate-pulse" />
        {/* 내용 */}
        <div className="h-3 w-full bg-gray-700 rounded animate-pulse" />
        <div className="h-3 w-3/4 bg-gray-700 rounded animate-pulse" />
      </div>
    </div>
  );
};

export default CommentSkeleton;