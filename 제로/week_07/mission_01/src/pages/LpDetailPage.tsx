import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { Heart } from "lucide-react";

import { useGetLpDetail } from "../hooks/queries/useGetLpDetail";
import { useGetInfiniteComments } from "../hooks/queries/useGetInfiniteComments";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";

import usePostLike from "../hooks/mutations/usePostLike";
import useDeleteLike from "../hooks/mutations/useDeleteLike";
import usePostComment from "../hooks/mutations/usePostComment";
import usePatchComment from "../hooks/mutations/usePatchComment";
import useDeleteComment from "../hooks/mutations/useDeleteComment";
import usePatchLp from "../hooks/mutations/usePatchLp";
import useDeleteLp from "../hooks/mutations/useDeleteLp";

import { useAuth } from "../context/AuthContext";

import CommentSkeleton from "../components/CommentSkeleton";

import type { Likes } from "../types/lp";

const LpDetailPage = () => {
  const navigate = useNavigate();

  const { lpid } = useParams();

  const [order, setOrder] =
    useState<"desc" | "asc">("desc");

  const [commentInput, setCommentInput] =
    useState("");

  const [commentError, setCommentError] =
    useState("");

  const [
    isEditModalOpen,
    setIsEditModalOpen,
  ] = useState(false);

  const [editTitle, setEditTitle] =
    useState("");

  const [
    editLpContent,
    setEditLpContent,
  ] = useState("");

  const [
    editingCommentId,
    setEditingCommentId,
  ] = useState<number | null>(null);

  const [editContent, setEditContent] =
    useState("");

  const { isLoggedIn } = useAuth();

  const {
    data: lp,
    isPending,
    isError,
    refetch,
  } = useGetLpDetail(lpid);

  const { data: me } =
    useGetMyInfo(isLoggedIn);

  const isMyLp =
    me?.data.id === lp?.author.id;

  const { mutate: likeMutate } =
    usePostLike();

  const { mutate: dislikeMutate } =
    useDeleteLike();

  const { mutate: postCommentMutate } =
    usePostComment(
      Number(lpid),
      () => setCommentInput("")
    );

  const { mutate: patchCommentMutate } =
  usePatchComment();

  const {
    mutate: deleteCommentMutate,
  } = useDeleteComment();

  const {
    mutate: patchLpMutate,
    isPending: isPatchPending,
  } = usePatchLp(Number(lpid));

  const { mutate: deleteLpMutate } =
    useDeleteLp(() => {
      navigate("/", {
        replace: true,
      });
    });

  const isLiked =
    lp?.likes?.some(
      (like: Likes) =>
        like.userId === me?.data.id
    ) ?? false;

  const {
    data: commentData,
    isPending: isCommentPending,
    isFetching: isCommentFetching,
    hasNextPage,
    fetchNextPage,
  } = useGetInfiniteComments(
    lpid!,
    order
  );

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (
      inView &&
      !isCommentFetching &&
      hasNextPage
    ) {
      fetchNextPage();
    }
  }, [
    inView,
    isCommentFetching,
    hasNextPage,
    fetchNextPage,
  ]);

  useEffect(() => {
    if (lp) {
      setEditTitle(lp.title);

      setEditLpContent(lp.content);
    }
  }, [lp]);

  const comments =
    commentData?.pages.flatMap(
      (page) => page.data.data
    ) ?? [];

  const handleLikeLp = () => {
    likeMutate({
      lpid: Number(lpid),
    });
  };

  const handleDisLikeLp = () => {
    dislikeMutate({
      lpid: Number(lpid),
    });
  };

  const handleLikeClick = () => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");

      return;
    }

    if (isLiked) {
      handleDisLikeLp();
    } else {
      handleLikeLp();
    }
  };

  const handleDeleteLp = () => {
    const ok = window.confirm(
      "정말 삭제하시겠습니까?"
    );

    if (!ok) return;

    deleteLpMutate(Number(lpid));
  };

  const handleCommentSubmit = () => {
    if (
      commentInput.trim().length === 0
    ) {
      setCommentError(
        "댓글을 입력해주세요."
      );

      return;
    }

    if (
      commentInput.trim().length < 2
    ) {
      setCommentError(
        "댓글은 2자 이상 입력해주세요."
      );

      return;
    }

    setCommentError("");

    postCommentMutate({
      lpid: Number(lpid),
      content: commentInput,
    });
  };

  if (isPending || !lp) {
    return (
      <div className="text-white p-10">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-400 p-10">
        Error...

        <button
          onClick={() => refetch()}
        >
          retry
        </button>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-[#0f0f10] text-white flex justify-center p-10">
    <div className="w-full max-w-4xl flex flex-col gap-8">

      {/* LP 카드 */}
      <div className="bg-[#1b1c20] rounded-2xl overflow-hidden shadow-lg">
        <img
          src={lp.thumbnail}
          alt={lp.title}
          className="w-full h-[400px] object-cover"
        />

        <div className="p-6 flex flex-col gap-4">

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">
                {lp.title}
              </h1>

              <p className="text-gray-400 mt-2">
                {lp.content}
              </p>
            </div>

            {isMyLp && (
              <div className="flex gap-3">

                <button
                  onClick={() =>
                    setIsEditModalOpen(true)
                  }
                  className="text-blue-400 hover:text-blue-300"
                >
                  수정
                </button>

                <button
                  onClick={handleDeleteLp}
                  className="text-red-400 hover:text-red-300"
                >
                  삭제
                </button>

              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-4">

            <div className="flex items-center gap-3">
              <img
                src={
                  lp.author.avatar ||
                  "https://placehold.co/40x40"
                }
                alt={lp.author.name}
                className="w-10 h-10 rounded-full object-cover"
              />

              <div>
                <p className="font-semibold">
                  {lp.author.name}
                </p>

                <p className="text-sm text-gray-500">
                  {new Date(
                    lp.createdAt
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>

            <button
              onClick={handleLikeClick}
              className="flex items-center gap-2"
            >
              <Heart
                className={`
                  w-6 h-6 transition-colors
                  ${
                    isLiked
                      ? "fill-pink-500 text-pink-500"
                      : "text-gray-400"
                  }
                `}
              />

              <span>{lp.likes.length}</span>
            </button>

          </div>
        </div>
      </div>

      {/* 댓글 작성 */}
      <div className="bg-[#1b1c20] rounded-2xl p-6 flex flex-col gap-4">

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">
            댓글
          </h2>

          <select
            value={order}
            onChange={(e) =>
              setOrder(
                e.target.value as
                  | "asc"
                  | "desc"
              )
            }
            className="
              bg-[#0f0f10]
              border border-gray-700
              rounded-lg px-3 py-2
            "
          >
            <option value="desc">
              최신순
            </option>

            <option value="asc">
              오래된순
            </option>
          </select>
        </div>

        <textarea
          value={commentInput}
          onChange={(e) =>
            setCommentInput(
              e.target.value
            )
          }
          placeholder="댓글을 입력해주세요."
          className="
            bg-[#0f0f10]
            border border-gray-700
            rounded-lg p-4
            resize-none h-28
          "
        />

        {commentError && (
          <p className="text-red-400 text-sm">
            {commentError}
          </p>
        )}

        <button
          onClick={handleCommentSubmit}
          className="
            bg-pink-500 hover:bg-pink-600
            transition-colors
            rounded-lg py-3
            font-semibold
          "
        >
          댓글 작성
        </button>
      </div>

      {/* 댓글 리스트 */}
      <div className="flex flex-col gap-4">

        {comments.map((comment) => (
          <div
            key={comment.id}
            className="
              bg-[#1b1c20]
              rounded-2xl
              p-5
              flex flex-col gap-4
            "
          >

            <div className="flex justify-between items-start">

              <div className="flex gap-3 items-center">
                <img
                  src={
                    comment.author.avatar ||
                    "https://placehold.co/40x40"
                  }
                  alt={comment.author.name}
                  className="w-10 h-10 rounded-full"
                />

                <div>
                  <p className="font-semibold">
                    {comment.author.name}
                  </p>

                  <p className="text-xs text-gray-500">
                    {new Date(
                      comment.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {me?.data.id ===
                comment.author.id && (
                <div className="flex gap-3">

                  <button
                    onClick={() => {
                      setEditingCommentId(
                        comment.id
                      );

                      setEditContent(
                        comment.content
                      );
                    }}
                    className="text-blue-400"
                  >
                    수정
                  </button>

                  <button
                    onClick={() =>
                      deleteCommentMutate({
                        lpid: Number(lpid),
                        commentId: comment.id,
                      })
                    }
                    className="text-red-400"
                  >
                    삭제
                  </button>

                </div>
              )}
            </div>

            {editingCommentId ===
            comment.id ? (
              <div className="flex flex-col gap-3">

                <textarea
                  value={editContent}
                  onChange={(e) =>
                    setEditContent(
                      e.target.value
                    )
                  }
                  className="
                    bg-[#0f0f10]
                    border border-gray-700
                    rounded-lg p-3
                    resize-none
                  "
                />

                <div className="flex gap-2">

                  <button
                    onClick={() => {
                      patchCommentMutate({
                        lpid: Number(lpid),
                        commentId: comment.id,
                        content: editContent,
                      });

                      setEditingCommentId(
                        null
                      );
                    }}
                    className="
                      bg-pink-500
                      rounded-lg px-4 py-2
                    "
                  >
                    저장
                  </button>

                  <button
                    onClick={() =>
                      setEditingCommentId(
                        null
                      )
                    }
                    className="
                      bg-gray-700
                      rounded-lg px-4 py-2
                    "
                  >
                    취소
                  </button>

                </div>
              </div>
            ) : (
              <p className="text-gray-300">
                {comment.content}
              </p>
            )}
          </div>
        ))}

        {(isCommentPending ||
          isCommentFetching) && (
          <>
            <CommentSkeleton />
            <CommentSkeleton />
          </>
        )}

        <div ref={ref} />
      </div>

      {/* LP 수정 모달 */}
      {isEditModalOpen && (
        <div
          className="
            fixed inset-0
            bg-black/60
            flex items-center
            justify-center
            z-50
          "
        >
          <div
            className="
              bg-[#1b1c20]
              p-6
              rounded-2xl
              w-[500px]
            "
          >

            <h2 className="text-2xl font-bold mb-5">
              LP 수정
            </h2>

            <div className="flex flex-col gap-4">

              <input
                value={editTitle}
                onChange={(e) =>
                  setEditTitle(
                    e.target.value
                  )
                }
                className="
                  bg-[#0f0f10]
                  border border-gray-700
                  rounded-lg px-4 py-3
                "
              />

              <textarea
                value={editLpContent}
                onChange={(e) =>
                  setEditLpContent(
                    e.target.value
                  )
                }
                className="
                  bg-[#0f0f10]
                  border border-gray-700
                  rounded-lg px-4 py-3
                  h-40 resize-none
                "
              />

              <div className="flex gap-3">

                <button
                  onClick={() =>
                    setIsEditModalOpen(
                      false
                    )
                  }
                  className="
                    flex-1 py-3
                    rounded-lg
                    bg-gray-700
                  "
                >
                  취소
                </button>

                <button
                  onClick={() => {

                    patchLpMutate({
                      lpid:
                        Number(lpid),

                      title:
                        editTitle,

                      content:
                        editLpContent,
                    });

                    setIsEditModalOpen(
                      false
                    );
                  }}
                  disabled={
                    isPatchPending
                  }
                  className="
                    flex-1 py-3
                    rounded-lg
                    bg-pink-500
                  "
                >
                  {isPatchPending
                    ? "수정 중..."
                    : "저장"}
                </button>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
};

export default LpDetailPage;