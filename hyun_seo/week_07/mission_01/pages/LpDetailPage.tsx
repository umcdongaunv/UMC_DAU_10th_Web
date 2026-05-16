import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Heart, Send, User, MessageSquare, Trash2, Edit3, MoreVertical, ChevronLeft } from "lucide-react";
import { axiosInstance } from "../apis/axios";
import { QUERY_KEY } from "../constants/key";
import type { ResponseCommentDto, Tag, ResponseLpDto, Comment } from "../types/lp";
import { Loading } from "../components/Loading";
import { Error } from "../components/Error";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import { useAuth } from "../context/AuthContext";

const CommentSkeleton = () => (
  <div className="p-5 bg-[#1e1f24] rounded-xl border border-gray-800 flex flex-col gap-3 animate-pulse">
    <div className="flex justify-between items-center">
      <div className="h-3 w-20 bg-gray-700 rounded" />
      <div className="h-2 w-16 bg-gray-800 rounded" />
    </div>
    <div className="space-y-2">
      <div className="h-3 w-full bg-gray-700 rounded" />
      <div className="h-3 w-4/5 bg-gray-700 rounded" />
    </div>
  </div>
);

export const LpDetailPage = () => {
  const { lpId } = useParams<{ lpId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();
  
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [commentInput, setCommentInput] = useState("");
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editInput, setEditInput] = useState("");

  const observerRef = useRef<HTMLDivElement>(null);
  const { data: me } = useGetMyInfo(accessToken);

  // 1. 게시글 상세 조회
  const { data: lpRes, isPending, isError } = useQuery<ResponseLpDto>({
    queryKey: [QUERY_KEY.lps, lpId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/v1/lps/${lpId}`);
      return data;
    },
    enabled: !!lpId,
  });

  // 2. 댓글 무한 스크롤 조회
  const {
    data: commentData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status: commentStatus,
  } = useInfiniteQuery<ResponseCommentDto>({
    queryKey: ["lpComments", lpId, order],
    queryFn: async ({ pageParam }) => {
      const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
        params: { cursor: pageParam, order, limit: 10 },
      });
      return data;
    },
    initialPageParam: null,
    getNextPageParam: (lastPage: any) => lastPage.data?.nextCursor ?? undefined,
    enabled: !!lpId,
  });

  // 3. 댓글 작성 Mutation
  const createCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      return await axiosInstance.post(`/v1/lps/${lpId}/comments`, { content });
    },
    onSuccess: () => {
      setCommentInput("");
      queryClient.invalidateQueries({ queryKey: ["lpComments", lpId] });
    },
    onError: () => alert("댓글 작성에 실패했습니다."),
  });

  // 4. 댓글 수정 Mutation
  const updateCommentMutation = useMutation({
    mutationFn: async ({ commentId, content }: { commentId: number; content: string }) => {
      return await axiosInstance.patch(`/v1/lps/${lpId}/comments/${commentId}`, { content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lpComments", lpId] });
      setEditingId(null);
      setEditInput("");
      setMenuOpenId(null);
    },
    onError: () => alert("댓글 수정에 실패했습니다."),
  });

  // 5. 댓글 삭제 Mutation
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: number) => {
      return await axiosInstance.delete(`/v1/lps/${lpId}/comments/${commentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lpComments", lpId] });
      setMenuOpenId(null);
    },
    onError: () => alert("댓글 삭제에 실패했습니다."),
  });

  // 6. 게시글 삭제 Mutation
  const deleteLpMutation = useMutation({
    mutationFn: async () => {
      return await axiosInstance.delete(`/v1/lps/${lpId}`);
    },
    onSuccess: () => {
      alert("게시글이 삭제되었습니다.");
      // 전체 목록 무효화 및 해당 단건 상세 캐시 제거 (메모리 클린업)
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
      queryClient.removeQueries({ queryKey: [QUERY_KEY.lps, lpId] });
      navigate("/lps", { replace: true });
    },
    onError: () => {
      alert("삭제 중 오류가 발생했습니다.");
    }
  });

  // 7. 게시글 좋아요 Mutation
  const likeMutation = useMutation({
    mutationFn: async () => await axiosInstance.post(`/v1/lps/${lpId}/like`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps, lpId] }),
  });

  // 무한 스크롤 Observer 설정
  useEffect(() => {
    if (!observerRef.current || !hasNextPage || isFetchingNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchNextPage();
      },
      { threshold: 0.5 }
    );
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 핸들러 함수들
  const handleDeleteLp = () => {
    if (window.confirm("정말 이 게시글을 삭제하시겠습니까?")) {
      deleteLpMutation.mutate();
    }
  };

  const handleEditLp = () => {
    navigate(`/lps/${lpId}/edit`);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || createCommentMutation.isPending) return;
    createCommentMutation.mutate(commentInput);
  };

  const handleEditClick = (comment: Comment) => {
    setEditingId(comment.id);
    setEditInput(comment.content);
    setMenuOpenId(null);
  };

  const handleUpdateSubmit = (commentId: number) => {
    if (!editInput.trim() || updateCommentMutation.isPending) return;
    updateCommentMutation.mutate({ commentId, content: editInput });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditInput("");
  };

  if (isPending) return <Loading />;
  if (isError || !lpRes?.data) return <Error message="데이터 로드 실패" onBack={() => navigate(-1)} />;

  const lp = lpRes.data;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center p-4 mt-18 gap-8">
      <div className="w-full max-w-2xl flex justify-start">
        <button onClick={() => navigate(-1)} className="text-neutral-500 hover:text-white flex items-center gap-1 transition-colors">
          <ChevronLeft size={20} /> Back
        </button>
      </div>

      {/* 게시글 본문 영역 */}
      <article className="w-full max-w-2xl bg-[#161b22] rounded-3xl border border-neutral-800 p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neutral-700 rounded-full flex items-center justify-center overflow-hidden">
              {lp.author?.avatar ? (
                <img src={lp.author.avatar} alt="p" className="w-full h-full object-cover" />
              ) : (
                <User size={24} className="text-neutral-400" />
              )}
            </div>
            <p className="text-white font-bold text-sm">{lp.author?.name}</p>
          </div>
          {/* 게시글 작성자 본인 확인 시 수정/삭제 노출 */}
          {me?.data.id === lp.authorId && (
            <div className="flex gap-2">
              <button 
                onClick={handleEditLp}
                disabled={deleteLpMutation.isPending}
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-1 text-sm disabled:opacity-50"
              >
                <Edit3 size={18} /> 수정
              </button>
              <button 
                onClick={handleDeleteLp}
                disabled={deleteLpMutation.isPending}
                className="p-2 text-neutral-400 hover:text-rose-500 hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-1 text-sm disabled:opacity-50"
              >
                <Trash2 size={18} /> {deleteLpMutation.isPending ? "삭제 중..." : "삭제"}
              </button>
            </div>
          )}
        </div>

        <h1 className="text-white text-3xl font-bold mb-8">{lp.title}</h1>

        <div className="flex justify-center mb-8">
          <img src={lp.thumbnail} alt={lp.title} className="w-full max-w-md aspect-square object-cover rounded-2xl border border-neutral-800 shadow-xl" />
        </div>

        <p className="text-neutral-300 leading-relaxed text-lg mb-8 whitespace-pre-wrap">{lp.content}</p>

        {lp.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {lp.tags.map((tag: Tag) => (
              <span key={tag.id} className="bg-neutral-800 text-neutral-400 px-3 py-1 rounded-full text-xs border border-neutral-700">
                # {tag.name}
              </span>
            ))}
          </div>
        )}

        <div className="pt-6 border-t border-neutral-800 flex justify-center">
          <button onClick={() => likeMutation.mutate()} className="flex items-center gap-2 group active:scale-95 transition-transform">
            <Heart size={28} className={lp.likes.length > 0 ? "text-rose-500" : "text-neutral-500"} fill={lp.likes.length > 0 ? "currentColor" : "none"} />
            <span className={`text-xl font-bold ${lp.likes.length > 0 ? "text-rose-500" : "text-neutral-500"}`}>{lp.likes.length}</span>
          </button>
        </div>
      </article>

      {/* 댓글 섹션 영역 */}
      <section className="w-full max-w-2xl space-y-6 mb-20">
        <div className="flex justify-between items-center px-2">
          <h2 className="text-white text-xl font-bold flex items-center gap-2">
            <MessageSquare size={22} className="text-red-600" /> 댓글
          </h2>
          <div className="flex bg-[#161b22] p-1 rounded-lg border border-neutral-800">
            <button onClick={() => setOrder("desc")} className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${order === "desc" ? "bg-white text-black shadow-lg" : "text-gray-400 hover:text-white"}`}>최신순</button>
            <button onClick={() => setOrder("asc")} className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${order === "asc" ? "bg-white text-black shadow-lg" : "text-gray-400 hover:text-white"}`}>오래된순</button>
          </div>
        </div>

        {/* 댓글 작성 폼 */}
        <div className="bg-[#161b22] rounded-2xl border border-neutral-800 p-4 shadow-xl">
          <form onSubmit={handleCommentSubmit} className="flex items-center gap-3">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="따뜻한 댓글을 남겨주세요... ✍️"
              className="flex-1 bg-black border border-neutral-800 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:ring-1 focus:ring-red-700 transition-all"
            />
            <button type="submit" disabled={!commentInput.trim() || createCommentMutation.isPending} className={`p-3 rounded-xl transition-colors ${commentInput.trim() && !createCommentMutation.isPending ? 'bg-red-600 text-white' : 'bg-neutral-800 text-neutral-500'}`}>
              <Send size={18} />
            </button>
          </form>
        </div>

        {/* 댓글 리스트 */}
        <div className="space-y-4">
          {commentStatus === "pending" ? (
            <>
              <CommentSkeleton />
              <CommentSkeleton />
              <CommentSkeleton />
            </>
          ) : (
            <>
              {commentData?.pages.map((page) =>
                page.data?.data?.map((comment: Comment) => (
                  <div key={comment.id} className="p-5 bg-[#161b22] rounded-2xl border border-neutral-800 flex flex-col gap-3 relative transition-all hover:border-neutral-700">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-neutral-700 rounded-full overflow-hidden flex items-center justify-center border border-neutral-600">
                          {comment.author.avatar ? <img src={comment.author.avatar} alt="a" className="w-full h-full object-cover" /> : <User size={14} className="text-neutral-400" />}
                        </div>
                        <span className="text-red-400 text-xs font-bold">{comment.author.name}</span>
                      </div>
                      
                      {/* 댓글 작성자 본인 확인 시 드롭다운 노출 */}
                      {me?.data.id === comment.authorId && (
                        <div className="relative">
                          <button onClick={() => setMenuOpenId(menuOpenId === comment.id ? null : comment.id)} className="text-neutral-500 hover:text-white p-1 transition-colors">
                            <MoreVertical size={18} />
                          </button>
                          {menuOpenId === comment.id && (
                            <div className="absolute right-0 mt-2 w-24 bg-[#1e1f24] border border-neutral-700 rounded-xl shadow-2xl z-10 overflow-hidden">
                              <button onClick={() => handleEditClick(comment)} className="w-full px-4 py-2 text-xs text-left text-neutral-300 hover:bg-neutral-800 flex items-center gap-2 transition-colors">
                                <Edit3 size={14} /> 수정
                              </button>
                              <button 
                                onClick={() => { 
                                  if (window.confirm("댓글을 삭제하시겠습니까?")) deleteCommentMutation.mutate(comment.id); 
                                }} 
                                disabled={deleteCommentMutation.isPending}
                                className="w-full px-4 py-2 text-xs text-left text-rose-500 hover:bg-neutral-800 flex items-center gap-2 transition-colors disabled:opacity-50"
                              >
                                <Trash2 size={14} /> 삭제
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* 댓글 수정 모드 toggle */}
                    {editingId === comment.id ? (
                      <div className="flex flex-col gap-2">
                        <textarea value={editInput} onChange={(e) => setEditInput(e.target.value)} className="w-full bg-black border border-neutral-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-red-700 resize-none min-h-20" />
                        <div className="flex justify-end gap-2">
                          <button onClick={handleCancelEdit} className="px-3 py-1 text-xs text-neutral-500 hover:text-white transition-colors">취소</button>
                          <button 
                            onClick={() => handleUpdateSubmit(comment.id)} 
                            disabled={!editInput.trim() || updateCommentMutation.isPending}
                            className="px-4 py-1 bg-red-600 text-white text-xs rounded-lg font-bold hover:bg-red-500 transition-colors disabled:opacity-50"
                          >
                            {updateCommentMutation.isPending ? "수정 중..." : "수정완료"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-neutral-300 text-sm leading-relaxed">{comment.content}</p>
                    )}
                    <span className="text-neutral-600 text-[10px] self-end">{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                ))
              )}

              {isFetchingNextPage && (
                <div className="space-y-4 pt-4">
                  <CommentSkeleton />
                  <CommentSkeleton />
                </div>
              )}
            </>
          )}
          
          <div ref={observerRef} className="h-10 w-full" />
        </div>
      </section>
    </div>
  );
};