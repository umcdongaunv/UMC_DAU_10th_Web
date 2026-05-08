import { useParams, useNavigate } from "react-router-dom";
import { 
  useQuery, 
  useMutation, 
  useQueryClient, 
  useInfiniteQuery 
} from "@tanstack/react-query";
import { axiosInstance } from "../apis/axios";
import { QUERY_KEY } from "../constants/key";
import type { ResponseCommentDto, Tag } from "../types/lp";
import { Loading } from "../components/Loading";
import { Error } from "../components/Error";
import { useEffect, useRef, useState } from "react";

export type ResponseLpDetailDto = {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    id: number;
    title: string;
    content: string;
    thumbnail: string;
    published: boolean;
    authorId: number;
    createdAt: string;
    updatedAt: string;
    tags: Tag[];
    likes: { id: number }[];
    author?: {
      name: string;
      avatar: string | null;
    };
  };
};

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
  const token = localStorage.getItem("accessToken");
  
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [commentInput, setCommentInput] = useState("");
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token) {
      alert("로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다. 🔒");
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);

  const { data, isPending, isError } = useQuery<ResponseLpDetailDto>({
    queryKey: [QUERY_KEY.lps, lpId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/v1/lps/${lpId}`);
      return data;
    },
    enabled: !!lpId && !!token,
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: commentData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status: commentStatus,
  } = useInfiniteQuery<ResponseCommentDto>({
    queryKey: ["lpComments", lpId, order],
    queryFn: async ({ pageParam }) => {
      const { data } = await axiosInstance.get(
        `/v1/lps/${lpId}/comments`,
        { params: { cursor: pageParam, order, limit: 10 } }
      );
      return data;
    },
    initialPageParam: null,
    getNextPageParam: (lastPage: any) => lastPage.data?.nextCursor ?? undefined,
    enabled: !!lpId && !!token,
  });

  const createCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      return await axiosInstance.post(`/v1/lps/${lpId}/comments`, { content });
    },
    onSuccess: () => {
      setCommentInput("");
      queryClient.invalidateQueries({ queryKey: ["lpComments", lpId] });
    },
    onError: () => {
      alert("댓글 작성에 실패했습니다. 다시 시도해주세요. 😥");
    }
  });

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    createCommentMutation.mutate(commentInput);
  };

  useEffect(() => {
    if (!observerRef.current || !hasNextPage || isFetchingNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchNextPage();
      },
      { threshold: 0 }
    );
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const deleteMutation = useMutation({
    mutationFn: async () => await axiosInstance.delete(`/v1/lps/${lpId}`),
    onSuccess: () => {
      alert("삭제 완료! 💨");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
      navigate("/", { replace: true });
    },
  });

  const likeMutation = useMutation({
    mutationFn: async () => await axiosInstance.post(`/v1/lps/${lpId}/like`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps, lpId] }),
  });

  if (!token) return null;
  if (isPending) return <Loading />;
  if (isError || !data?.data) return (
    <Error message="데이터를 찾을 수 없거나 불러오지 못했습니다. 🕵️‍♂️" onBack={() => navigate(-1)} />
  );

  const lpData = data.data;

  return (
    <div className="w-full flex flex-col items-center py-8 px-4 pt-20 bg-[#121212]">
      <article className="w-full max-w-2xl bg-[#1e1f24] rounded-2xl p-5 md:p-7 border border-gray-800 shadow-2xl relative mb-10">
        <div className="absolute top-6 right-6 flex gap-3 text-xl">
          <button onClick={() => navigate(`/lps/${lpId}/edit`)} className="hover:scale-125 transition-transform active:scale-95">📝</button>
          <button onClick={() => { if (window.confirm("정말 삭제할까요? 🥺")) deleteMutation.mutate(); }} className="hover:scale-125 transition-transform active:scale-95">🗑️</button>
        </div>

        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-green-400 to-blue-500 overflow-hidden shrink-0">
              {lpData.author?.avatar && <img src={lpData.author.avatar} alt="profile" className="w-full h-full object-cover" />}
            </div>
            <span className="text-white font-bold text-sm">{lpData.author?.name || "사용자"}</span>
          </div>
          <span className="text-gray-500 text-xs pr-16 md:pr-20">{new Date(lpData.createdAt).toLocaleDateString()}</span>
        </div>

        <h1 className="text-white text-2xl md:text-3xl font-black mb-5 break-all">{lpData.title}</h1>

        <div className="relative flex justify-center mb-6">
          <div className="w-44 h-44 sm:w-56 sm:h-56 relative shadow-2xl rounded-lg overflow-hidden group">
            <img src={lpData.thumbnail} alt={lpData.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
              <div className="w-1/4 h-1/4 bg-white rounded-full border-4 border-gray-300" />
            </div>
          </div>
        </div>

        <div className="text-gray-300 leading-relaxed mb-6 text-sm md:text-base whitespace-pre-wrap break-all line-clamp-3">{lpData.content}</div>

        {lpData.tags && lpData.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {lpData.tags.map((tag: Tag) => (
              <span key={tag.id} className="px-2.5 py-1 bg-[#2d2e35] text-blue-300 text-[11px] md:text-xs rounded-full border border-gray-700">🏷️ {tag.name}</span>
            ))}
          </div>
        )}

        <div className="flex justify-center border-t border-gray-800 pt-6">
          <button onClick={() => likeMutation.mutate()} className="flex items-center gap-2 text-white group transition-transform active:scale-95">
            <span className="text-2xl group-hover:scale-125 transition-transform">❤️</span>
            <span className="text-lg font-bold">{lpData.likes?.length ?? 0}</span>
          </button>
        </div>
      </article>

      <section className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-xl font-bold flex items-center gap-2">
            댓글 <span className="text-sm text-gray-500 font-normal">Comments</span>
          </h2>
          <div className="inline-flex bg-[#1a1a1a] p-1 rounded-lg border border-gray-800">
            <button onClick={() => setOrder("asc")} className={`px-5 py-1.5 text-sm font-bold rounded-md transition-all cursor-pointer ${order === "asc" ? "bg-white text-black" : "text-gray-400 hover:text-white"}`}>오래된순</button>
            <button onClick={() => setOrder("desc")} className={`px-5 py-1.5 text-sm font-bold rounded-md transition-all cursor-pointer ${order === "desc" ? "bg-white text-black" : "text-gray-400 hover:text-white"}`}>최신순</button>
          </div>
        </div>

        <form onSubmit={handleCommentSubmit} className="mb-8">
          <div className="flex flex-col gap-2 bg-[#1e1f24] p-3 rounded-xl border border-gray-800 focus-within:border-blue-500 transition-colors">
            <textarea
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="따뜻한 댓글 한마디를 남겨주세요... ✍️"
              className="w-full bg-transparent text-white text-sm outline-none resize-none h-10 py-1 placeholder:text-gray-600"
            />
            <div className="flex justify-end">
              <button
                disabled={createCommentMutation.isPending || !commentInput.trim()}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white text-[11px] font-bold rounded-lg transition-all active:scale-95"
              >
                {createCommentMutation.isPending ? "등록 중..." : "등록하기"}
              </button>
            </div>
          </div>
        </form>

        <div className="space-y-4">
          {commentStatus === "pending" ? (
            <>
              <CommentSkeleton />
              <CommentSkeleton />
              <CommentSkeleton />
            </>
          ) : !commentData || commentData.pages[0]?.data?.data?.length === 0 ? (
            <div className="text-gray-500 text-center py-10 italic">첫 번째 댓글을 남겨보세요! ✍️</div>
          ) : (
            <>
              {commentData.pages.map((page) =>
                page.data?.data?.map((comment: any) => (
                  <div key={comment.id} className="p-5 bg-[#1e1f24] rounded-xl border border-gray-800 flex flex-col gap-2 transition-all hover:border-gray-700">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-blue-400 text-xs font-semibold">{comment.author?.name || "익명"}</span>
                      <span className="text-gray-600 text-[10px]">{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{comment.content}</p>
                  </div>
                ))
              )}
              {isFetchingNextPage && (
                <div className="pt-4 space-y-4">
                  <CommentSkeleton />
                </div>
              )}
            </>
          )}
        </div>
        <div ref={observerRef} className="h-10 w-full" />
      </section>
    </div>
  );
};