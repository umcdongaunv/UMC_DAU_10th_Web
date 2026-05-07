import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 1. 라우팅을 위한 useNavigate 임포트
import useGetLpList from "../hooks/queries/useGetLpList";

export const HomePage = () => {
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const navigate = useNavigate(); // 2. navigate 함수 선언

  const { data, isPending, isError, error, refetch } = useGetLpList({ 
    order: order as any 
  });

  const lpList = data?.data?.data || [];

  // 3. 카드 클릭 시 상세 페이지로 이동하는 핸들러
  const handleCardClick = (lpId: number) => {
    navigate(`/lp/${lpId}`);
  };

  if (isError) {
    return (
      <div className="w-full flex flex-col items-center justify-center bg-black min-h-screen pt-20 text-white p-6">
        <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-red-900/50 flex flex-col items-center shadow-2xl">
          <span className="text-5xl mb-4">⚠️</span>
          <h2 className="text-xl font-bold mb-2">데이터를 불러오지 못했습니다</h2>
          <p className="text-gray-400 text-sm mb-6 text-center">
            {error instanceof Error ? error.message : "네트워크 상태를 확인해주세요."}
          </p>
          <button
            onClick={() => refetch()}
            className="px-8 py-2 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-all cursor-pointer active:scale-95"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col bg-black min-h-screen pt-20">
      <div className="w-full flex justify-end p-4 md:p-6">
        <div className="inline-flex bg-[#1a1a1a] p-1 rounded-lg border border-gray-800">
          <button
            onClick={() => setOrder("asc")}
            className={`px-5 py-1.5 text-sm font-bold rounded-md transition-all cursor-pointer ${
              order === "asc" ? "bg-white text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            오래된순
          </button>
          <button
            onClick={() => setOrder("desc")}
            className={`px-5 py-1.5 text-sm font-bold rounded-md transition-all cursor-pointer ${
              order === "desc" ? "bg-white text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            최신순
          </button>
        </div>
      </div>

      <div className="w-full p-4 md:p-6 overflow-y-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-1 md:gap-2">
          
          {isPending ? (
            Array.from({ length: 16 }).map((_, i) => (
              <div 
                key={`skeleton-${i}`} 
                className="aspect-square bg-[#1a1a1a] animate-pulse rounded-sm border border-gray-800"
              />
            ))
          ) : (
            lpList.map((lp: any) => (
              <div 
                key={lp.id} 
                /* 4. 클릭 이벤트 연결: lp.id를 인자로 전달 */
                onClick={() => handleCardClick(lp.id)}
                className="relative aspect-square overflow-hidden group cursor-pointer border border-transparent hover:border-red-600 transition-all"
              >
                <img
                  src={lp.thumbnail}
                  alt={lp.title}
                  className="w-full h-full object-cover grayscale-20 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 text-white">
                  <p className="text-xs font-bold truncate">{lp.title}</p>
                  <div className="flex justify-between items-center mt-1 text-[10px] text-gray-300">
                    <span>{new Date(lp.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-0.5">
                      ❤️ {lp.likes?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};