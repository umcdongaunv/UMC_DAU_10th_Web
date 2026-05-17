import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Settings, User, Check, X, Loader2 } from "lucide-react"; // 필요한 아이콘 추가
import { axiosInstance } from "../apis/axios";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import { useAuth } from "../context/AuthContext";
import { Loading } from "../components/Loading";

export const MyPage = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  
  // 1. 프로필 정보 가져오기
  const { data: me, isPending: isMeLoading } = useGetMyInfo(accessToken);
  
  // 편집(수정) 모드 상태 관리
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");

  // 탭 및 정렬 상태 관리
  const [activeTab, setActiveTab] = useState<"liked" | "written">("liked");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const observerRef = useRef<HTMLDivElement>(null);

  // 내 정보 데이터가 로드되면 수정용 state 초기화
  useEffect(() => {
    if (me?.data) {
      setEditName(me.data.name || "");
      setEditBio(me.data.bio || "");
    }
  }, [me]);

  // 2. 프로필 정보 수정 Mutation (SettingPage의 로직 반영)
  const updateProfileMutation = useMutation({
    mutationFn: async (payload: { name: string; bio: string }) => {
      const { data } = await axiosInstance.patch("/v1/users", {
        name: payload.name,
        bio: payload.bio,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myInfo"] }); // 내 정보 쿼리 갱신
      setIsEditing(false); // 수정 모드 종료
    },
    onError: () => {
      alert("프로필 수정 중 오류가 발생했습니다.");
    },
  });

  // 3. 무한 스크롤 데이터 쿼리
  const {
    data: lpData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["myLps", activeTab, order],
    queryFn: async ({ pageParam = 0 }) => {
      const url = activeTab === "liked" ? "/v1/lps/likes/me" : "/v1/lps/me";
      const { data } = await axiosInstance.get(url, {
        params: { cursor: pageParam, limit: 10, order },
      });
      return data.data; 
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage?.hasNext ? lastPage.nextCursor : undefined),
    enabled: !!accessToken,
  });

  const lps = lpData?.pages?.flatMap((page) => page?.data || []) || [];

  // 4. 무한 스크롤 Intersection Observer
  useEffect(() => {
    if (!observerRef.current || !hasNextPage || isFetchingNextPage) return;
    
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) fetchNextPage(); },
      { threshold: 0.5 }
    );
    
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 수정 제출 처리
  const handleSave = () => {
    if (!editName.trim()) return alert("이름은 필수 입력 항목입니다.");
    updateProfileMutation.mutate({
      name: editName,
      bio: editBio,
    });
  };

  // 취소 버튼 클릭 시 이전 데이터로 복원
  const handleCancel = () => {
    if (me?.data) {
      setEditName(me.data.name || "");
      setEditBio(me.data.bio || "");
    }
    setIsEditing(false);
  };

  if (isMeLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20 px-4 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        
        {/* 👤 상단 프로필 영역 (일반 모드 / 수정 모드 분기) */}
        <section className="flex items-start gap-6 mb-12 relative">
          <div className="w-32 h-32 bg-neutral-700 rounded-full overflow-hidden flex items-center justify-center border-4 border-neutral-800 shrink-0">
            {me?.data?.avatar ? (
              <img src={me.data.avatar} alt="profile" className="w-full h-full object-cover" />
            ) : (
              <User size={60} className="text-neutral-500" />
            )}
          </div>
          
          <div className="flex-1 mt-2 min-w-0">
            {!isEditing ? (
              /* [보기 모드] */
              <>
                <div className="flex items-center gap-4 mb-1">
                  <h1 className="text-3xl font-bold truncate">{me?.data?.name || "사용자"}</h1>
                  <button 
                    onClick={() => setIsEditing(true)} 
                    className="text-neutral-400 hover:text-white transition-colors shrink-0"
                    title="프로필 수정"
                  >
                    <Settings size={24} />
                  </button>
                </div>
                <p className="text-neutral-400 text-lg mb-2 break-all">
                  {me?.data?.bio || "한 줄 소개가 없습니다."}
                </p>
              </>
            ) : (
              /* [🔧 수정 모드] 인라인 Input 노출 */
              <div className="flex flex-col gap-3 max-w-md">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="이름을 입력하세요"
                    className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-1 text-xl font-bold focus:outline-none focus:border-white w-full"
                  />
                  {/* 저장 / 취소 버튼 묶음 */}
                  <div className="flex gap-1 shrink-0">
                    <button 
                      onClick={handleSave} 
                      disabled={updateProfileMutation.isPending}
                      className="p-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-md text-green-500 hover:text-green-400 transition-colors disabled:opacity-50"
                    >
                      {updateProfileMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                    </button>
                    <button 
                      onClick={handleCancel}
                      disabled={updateProfileMutation.isPending}
                      className="p-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-md text-red-500 hover:text-red-400 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="한 줄 소개를 입력하세요"
                  className="bg-neutral-900 border border-neutral-800 rounded-md px-3 py-1.5 text-sm text-neutral-300 focus:outline-none focus:border-neutral-600 w-full"
                />
              </div>
            )}
            <p className="text-neutral-500 text-sm mt-1">{me?.data?.email}</p>
          </div>
        </section>

        {/* 📑 탭 메뉴 영역 */}
        <div className="flex border-b border-neutral-800 mb-8 relative">
          <button
            onClick={() => setActiveTab("liked")}
            className={`px-8 py-4 text-lg font-bold transition-colors relative ${
              activeTab === "liked" ? "text-white" : "text-neutral-600 hover:text-neutral-400"
            }`}
          >
            내가 좋아요 한 LP
            {activeTab === "liked" && <div className="absolute bottom-0 left-0 w-full h-1 bg-white" />}
          </button>
          <button
            onClick={() => setActiveTab("written")}
            className={`px-8 py-4 text-lg font-bold transition-colors relative ${
              activeTab === "written" ? "text-white" : "text-neutral-600 hover:text-neutral-400"
            }`}
          >
            내가 작성한 LP
            {activeTab === "written" && <div className="absolute bottom-0 left-0 w-full h-1 bg-white" />}
          </button>
        </div>

        {/* 🎛️ 정렬 버튼 영역 */}
        <div className="flex justify-end mb-6">
          <div className="flex bg-[#161b22] p-1 rounded-lg border border-neutral-800">
            <button
              onClick={() => setOrder("asc")}
              className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${
                order === "asc" ? "bg-white text-black" : "text-gray-400 hover:text-white"
              }`}
            >
              오래된순
            </button>
            <button
              onClick={() => setOrder("desc")}
              className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${
                order === "desc" ? "bg-white text-black" : "text-gray-400 hover:text-white"
              }`}
            >
              최신순
            </button>
          </div>
        </div>

        {/* 💿 리스트 그리드 영역 */}
        {lps.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
            {lps.map((lp: any) => (
              <div 
                key={lp.id} 
                className="aspect-square bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800 group cursor-pointer hover:border-neutral-600 transition-all"
              >
                <img 
                  src={lp.thumbnail} 
                  alt={lp.title || "lp-cover"} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="col-span-full py-24 text-center text-neutral-500 border border-dashed border-neutral-800 rounded-xl">
            {activeTab === "liked" ? "좋아요 한 LP가 없습니다." : "작성한 LP가 없습니다."}
          </div>
        )}

        {/* 🔄 무한 스크롤 트리거 */}
        <div ref={observerRef} className="h-16 w-full flex items-center justify-center mb-10">
          {isFetchingNextPage && <Loading />}
        </div>

      </div>
    </div>
  );
};