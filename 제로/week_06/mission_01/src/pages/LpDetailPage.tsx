import { useParams } from "react-router-dom";
import { useGetLpDetail } from "../hooks/queries/useGetLpDetail";

const LpDetailPage = () => {
  const { lpid } = useParams();

  const {
    data: lp,
    isPending,
    isError,
    refetch,
  } = useGetLpDetail(lpid);

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
        <button onClick={() => refetch()}>
          retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f10] text-white flex justify-center p-10">
      
      {/* 카드 */}
      <div className="w-[600px] bg-[#1b1c20] rounded-2xl p-8 shadow-xl">

        {/* 헤더 (작성자 + 날짜 + 액션) */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <img
              src={lp.author.profileImage}
              alt={lp.author.nickname}
              className="w-10 h-10 rounded-full"
            />
            <span className="font-semibold">
              {lp.author.nickname}
            </span>
          </div>

          <div className="text-sm text-gray-400">
            {new Date(lp.createdAt).toLocaleDateString()}
          </div>
        </div>

        {/* 제목 */}
        <h1 className="text-2xl font-bold mb-2">
          {lp.title}
        </h1>

        {/* 썸네일 (LP 디스크) */}
        <div className="flex justify-center my-10">
          <div className="relative w-[300px] h-[300px]">
            <img
              src={lp.thumbnail}
              alt={lp.title}
              className="w-full h-full rounded-full object-cover animate-spin-slow"
            />
          </div>
        </div>

        {/* 본문 */}
        <p className="text-gray-300 mb-6">
          {lp.content}
        </p>

        {/* 태그 */}
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

        {/* 액션 */}
        <div className="flex justify-between items-center">
          
          {/* 좋아요 */}
          <div className="flex items-center gap-2">
            <button className="text-pink-400 text-xl">
              ❤️
            </button>
            <span>{lp.likes?.length ?? 0}</span>
          </div>

          {/* 수정 / 삭제 */}
          <div className="flex gap-3">
            <button className="text-blue-400">
              수정
            </button>
            <button className="text-red-400">
              삭제
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LpDetailPage;