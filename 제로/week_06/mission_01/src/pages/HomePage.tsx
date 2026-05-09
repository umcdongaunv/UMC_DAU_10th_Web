import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useGetLpList from "../hooks/queries/useGetLpList";
import { PAGINATION_ORDER } from "../enums/common";

const HomePage = () => {
  const navigate = useNavigate();

  const [sort, setSort] = useState("desc");

  const {
    data: lps,
    isPending,
    isError,
    refetch,
  } = useGetLpList(
    20,
    "",
    PAGINATION_ORDER.desc,
    0,
    sort
  );

  return (
    <div className="bg-black min-h-screen text-white p-10">
      
      {/* 정렬 버튼 */}
      <div className="flex gap-3 mb-10">
        <button
          onClick={() => setSort("desc")}
          className={`
            px-4 py-2 rounded
            ${sort === "desc"
              ? "bg-pink-500"
              : "bg-gray-700"}
          `}
        >
          최신순
        </button>
        

        <button
          onClick={() => setSort("asc")}
          className={`
            px-4 py-2 rounded
            ${sort === "asc"
              ? "bg-pink-500"
              : "bg-gray-700"}
          `}
        >
          오래된순
        </button>
      </div>

      {/* 로딩 */}
      {isPending && (
        <div className="grid grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="
                h-72
                rounded-xl
                bg-gray-800
                animate-pulse
              "
            />
          ))}
        </div>
      )}

      {/* 에러 */}
      {isError && (
        <div className="flex flex-col items-center gap-4">
          <p className="text-red-400">
            데이터를 불러오지 못했습니다.
          </p>

          <button
            onClick={() => refetch()}
            className="
              bg-pink-500
              px-4 py-2
              rounded
            "
          >
            다시 시도
          </button>
        </div>
      )}

      {/* 카드 */}
      {!isPending && !isError && (
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            gap-6
          "
        >
          {lps?.map((lp) => (
            <div
              key={lp.id}
              onClick={() => navigate(`/lp/${lp.id}`)}
              className="
                relative
                overflow-hidden
                rounded-2xl
                cursor-pointer
                group
              "
            >
              {/* 이미지 */}
              <img
                src={lp.thumbnail}
                alt={lp.title}
                className="
                  w-full
                  h-80
                  object-cover
                  transition-transform
                  duration-300
                  group-hover:scale-110
                "
              />

              {/* Overlay */}
              <div
                className="
                  absolute
                  inset-0
                  bg-black/60
                  opacity-0
                  group-hover:opacity-100
                  transition-opacity
                  duration-300
                  flex
                  flex-col
                  justify-end
                  p-4
                "
              >
                <h2 className="text-lg font-bold">
                  {lp.title}
                </h2>

                <p className="text-sm text-gray-300">
                  업로드일:
                  {new Date(lp.createdAt)
                    .toLocaleDateString()}
                </p>

                <p className="text-sm text-pink-400">
                  ❤️ {lp.likes?.length ?? 0}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;