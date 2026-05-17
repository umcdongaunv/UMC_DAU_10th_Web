import { useEffect, useState } from "react";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import { PAGINATION_ORDER } from "../enums/common";
import { useInView } from "react-intersection-observer";
import { LpCard } from "../components/LpCard/LpCard";
import { LpCardSkeletonList } from "../components/LpCard/LpCardSkeletonList";

export const HomePage = () => {
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const { data: lps, isFetching, hasNextPage, isPending, fetchNextPage, isError } =
    useGetInfiniteLpList(50, search, order === "asc" ? PAGINATION_ORDER.asc : PAGINATION_ORDER.desc);

  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView && !isFetching && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);

  if (isError) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <p className="text-red-400 text-lg tracking-widest uppercase">오류가 발생했습니다</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="sticky top-0 z-10 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <h1 className="text-xl font-bold tracking-tight text-white shrink-0">🎵 LP Search</h1>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full max-w-sm bg-neutral-800 border border-neutral-700 rounded-full px-4 py-2 text-sm text-white placeholder-neutral-500 outline-none focus:border-neutral-500 transition-colors"
          />
        </div>
      </div>

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

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {isPending ? (
            <LpCardSkeletonList count={20} />
          ) : (
            <>
              {lps?.pages
                ?.map((page) => page.data.data)
                .flat()
                .map((lp) => (
                  <LpCard key={lp.id} lp={lp} />
                ))}
              {isFetching && <LpCardSkeletonList count={8} />}
            </>
          )}
        </div>

        <div ref={ref} className="h-4" />

        {!hasNextPage && !isPending && (
          <p className="text-center text-neutral-600 text-sm py-8 tracking-widest uppercase">
            모든 항목을 불러왔습니다
          </p>
        )}
      </div>
    </div>
  );
};