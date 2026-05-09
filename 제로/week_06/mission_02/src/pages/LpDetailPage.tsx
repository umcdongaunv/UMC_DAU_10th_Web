import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";

import { useGetLpDetail } from "../hooks/queries/useGetLpDetail";
import { useGetInfiniteComments } from "../hooks/queries/useGetInfiniteComments";
import CommentSkeleton from "../components/CommentSkeleton";

const LpDetailPage = () => {
  const { lpid } = useParams();
  const [order, setOrder] = useState<"desc" | "asc">("desc");
  const [commentInput, setCommentInput] = useState("");
  const [commentError, setCommentError] = useState("");

  const {
    data: lp,
    isPending,
    isError,
    refetch,
  } = useGetLpDetail(lpid);

  const {
    data: commentData,
    isPending: isCommentPending,
    isFetching: isCommentFetching,
    hasNextPage,
    fetchNextPage,
  } = useGetInfiniteComments(lpid!, order);

  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView && !isCommentFetching && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, isCommentFetching, hasNextPage, fetchNextPage]);

  const comments = commentData?.pages.flatMap((page) => page.data.data) ?? [];

  const handleCommentSubmit = () => {
    if (commentInput.trim().length === 0) {
      setCommentError("댓글을 입력해주세요.");
      return;
    }
    if (commentInput.trim().length < 2) {
      setCommentError("댓글은 2자 이상 입력해주세요.");
      return;
    }
    setCommentError("");
    setCommentInput("");
  };

  if (isPending || !lp) {
    return <div className="text-white p-10">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="text-red-400 p-10">
        Error...
        <button onClick={() => refetch()}>retry</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f10] text-white flex justify-center p-10">
      <div className="w-[600px] bg-[#1b1c20] rounded-2xl p-8 shadow-xl">


        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <img
              src={lp.author.profileImage}
              alt={lp.author.nickname}
              className="w-10 h-10 rounded-full"
            />
            <span className="font-semibold">{lp.author.nickname}</span>
          </div>
          <div className="text-sm text-gray-400">
            {new Date(lp.createdAt).toLocaleDateString()}
          </div>
        </div>


        <h1 className="text-2xl font-bold mb-2">{lp.title}</h1>


        <div className="flex justify-center my-10">
          <div className="relative w-[300px] h-[300px]">
            <img
              src={lp.thumbnail}
              alt={lp.title}
              className="w-full h-full rounded-full object-cover animate-spin-slow"
            />
          </div>
        </div>

        <p className="text-gray-300 mb-6">{lp.content}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {lp.tags?.map((tag: { id: number; name: string }) => (
            <span
              key={tag.id}
              className="bg-gray-700 px-3 py-1 rounded-full text-sm"
            >
              #{tag.name}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-2">
            <button className="text-pink-400 text-xl">❤️</button>
            <span>{lp.likes?.length ?? 0}</span>
          </div>
          <div className="flex gap-3">
            <button className="text-blue-400">수정</button>
            <button className="text-red-400">삭제</button>
          </div>
        </div>


        <hr className="border-gray-700 mb-6" />

        <div className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => {
                setCommentInput(e.target.value);
                setCommentError("");
              }}
              placeholder="댓글을 입력해주세요."
              className="flex-1 bg-[#0f0f10] border border-gray-600 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
            />
            <button
              onClick={handleCommentSubmit}
              className="px-4 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg text-sm font-semibold transition-colors"
            >
              등록
            </button>
          </div>
          {commentError && (
            <p className="text-red-400 text-xs mt-1 ml-1">{commentError}</p>
          )}
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setOrder("desc")}
            className={`px-3 py-1 rounded text-sm ${
              order === "desc" ? "bg-pink-500" : "bg-gray-700"
            }`}
          >
            최신순
          </button>
          <button
            onClick={() => setOrder("asc")}
            className={`px-3 py-1 rounded text-sm ${
              order === "asc" ? "bg-pink-500" : "bg-gray-700"
            }`}
          >
            오래된순
          </button>
        </div>

        {isCommentPending && (
          <div>
            {Array.from({ length: 5 }).map((_, i) => (
              <CommentSkeleton key={i} />
            ))}
          </div>
        )}


        {!isCommentPending && (
          <div>
            {comments.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-6">
                첫 댓글을 남겨보세요!
              </p>
            )}

            {comments.map((comment) => (
              <div
                key={comment.id}
                className="flex gap-3 py-4 border-b border-gray-700"
              >
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs shrink-0">
                  {comment.author.name[0]}
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">
                      {comment.author.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">{comment.content}</p>
                </div>
              </div>
            ))}

            <div ref={ref} className="h-4" />

            {isCommentFetching && (
              <div>
                {Array.from({ length: 3 }).map((_, i) => (
                  <CommentSkeleton key={i} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LpDetailPage;