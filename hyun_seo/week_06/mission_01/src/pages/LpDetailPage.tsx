import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../apis/axios";
import { QUERY_KEY } from "../constants/key";
import type { Tag, Like } from "../types/lp";
import { Loading } from "../components/Loading";
import { Error } from "../components/Error";
import { useEffect } from "react";

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
    likes: Like[];
    author?: {
      name: string;
      avatar: string | null;
    };
  };
};

export const LpDetailPage = () => {
  const { lpId } = useParams<{ lpId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const token = localStorage.getItem("accessToken"); 

  useEffect(() => {
    if (!token) {
      alert("로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다. 🔒");
      navigate("/login", { replace: true }); // replace: true로 히스토리를 덮어써서 뒤로가기 방지
    }
  }, [token, navigate]);

  if (!token) return null;

  const { data, isPending, isError } = useQuery<ResponseLpDetailDto>({
    queryKey: [QUERY_KEY.lps, lpId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/v1/lps/${lpId}`);
      return data;
    },
    enabled: !!lpId && !!token,
    staleTime: 1000 * 60 * 5,
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return await axiosInstance.delete(`/v1/lps/${lpId}`);
    },
    onSuccess: () => {
      alert("삭제 완료! 💨");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
      navigate("/lps", { replace: true });
    },
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      return await axiosInstance.post(`/v1/lps/${lpId}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps, lpId] });
    },
  });

  const lpData = data?.data;

  if (isPending) return <Loading />;
  if (isError || !lpData) {return (
    <Error
      message="데이터를 찾을 수 없거나 불러오지 못했습니다. 🕵️‍♂️" 
      onBack={() => navigate(-1)} 
    />
  );
  }

  if (isPending) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !lpData) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white px-4 text-center">
        <p className="mb-4 text-base">데이터를 찾을 수 없어요! 🕵️‍♂️</p>
        <button 
          onClick={() => navigate(-1)} 
          className="px-4 py-2 bg-red-600 hover:bg-red-700 transition-colors rounded-md text-sm font-medium"
        >
          뒤로 가기 🔙
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-black min-h-screen">
      <div className="flex flex-col items-center pt-20 pb-20 px-4">
        
        <article className="w-full max-w-2xl bg-[#1e1f24] rounded-2xl p-5 md:p-7 border border-gray-800 shadow-2xl relative">
          
          {/* 우측 상단 이모지 액션 버튼 영역 */}
          <div className="absolute top-6 right-6 flex gap-3 text-xl">
            <button 
              onClick={() => navigate(`/lps/${lpId}/edit`)}
              title="수정하기"
              className="hover:scale-125 transition-transform active:scale-95"
            >
              📝
            </button>
            <button 
              onClick={() => {
                if(window.confirm("정말 삭제할까요? 🥺")) deleteMutation.mutate();
              }}
              title="삭제하기"
              className="hover:scale-125 transition-transform active:scale-95"
            >
              🗑️
            </button>
          </div>

          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-green-400 to-blue-500 overflow-hidden shrink-0">
                {lpData.author?.avatar && (
                  <img src={lpData.author.avatar} alt="profile" className="w-full h-full object-cover" />
                )}
              </div>
              <span className="text-white font-bold text-sm">
                {lpData.author?.name || "사용자"}
              </span>
            </div>
            <span className="text-gray-500 text-xs pr-16 md:pr-20"> 
              {new Date(lpData.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="mb-5">
            <h1 className="text-white text-2xl md:text-3xl font-black leading-tight break-all">
              {lpData.title}
            </h1>
          </div>

          <div className="relative flex justify-center mb-6">
            <div className="w-44 h-44 sm:w-56 sm:h-56 relative shadow-2xl rounded-lg overflow-hidden group">
              <img 
                src={lpData.thumbnail} 
                alt={lpData.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                <div className="w-1/4 h-1/4 bg-white rounded-full border-4 border-gray-300" />
              </div>
            </div>
          </div>

          <div className="text-gray-300 leading-relaxed mb-6 text-sm md:text-base whitespace-pre-wrap break-all line-clamp-3">
            {lpData.content}
          </div>

          {lpData.tags && lpData.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-6">
              {lpData.tags.map((tag: Tag) => (
                <span 
                  key={tag.id} 
                  className="px-2.5 py-1 bg-[#2d2e35] text-blue-300 text-[11px] md:text-xs rounded-full border border-gray-700"
                >
                  🏷️ {tag.name}
                </span>
              ))}
            </div>
          )}

          <div className="flex justify-center border-t border-gray-800 pt-6 h-8">
            <button 
              onClick={() => likeMutation.mutate()}
              disabled={likeMutation.isPending}
              className={`flex items-center gap-2 text-white group outline-none transition-transform active:scale-95 ${likeMutation.isPending ? 'opacity-50' : ''}`}
            >
              <span className="text-2xl group-hover:scale-120 transition-transform">
                ❤️
              </span>
              <span className="text-lg font-bold">
                {lpData?.likes?.length ?? 0}
              </span>
            </button>
          </div>

        </article>
      </div>
    </div>
  );
};