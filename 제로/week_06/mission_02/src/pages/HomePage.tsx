import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";

import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import { PAGINATION_ORDER } from "../enums/common";
import LpCard from "../components/LpCard/LpCard";
import LpCardSkeleton from "../components/LpCard/LpCardSkeleton";

const HomePage = () => {
  const [sort, setSort] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);

  const {
    data,
    isFetching,
    hasNextPage,
    isPending,
    isError,
    fetchNextPage,
  } = useGetInfiniteLpList(20, "", sort);

  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView && !isFetching && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);

  const lps = data?.pages.flatMap((page) => page.data.data) ?? [];

  return (
    <div className="bg-black min-h-screen text-white p-10">

      <div className="flex gap-3 mb-10">
        <button
          onClick={() => setSort(PAGINATION_ORDER.desc)}
          className={`px-4 py-2 rounded ${
            sort === PAGINATION_ORDER.desc ? "bg-pink-500" : "bg-gray-700"
          }`}
        >
          최신순
        </button>

        <button
          onClick={() => setSort(PAGINATION_ORDER.asc)}
          className={`px-4 py-2 rounded ${
            sort === PAGINATION_ORDER.asc ? "bg-pink-500" : "bg-gray-700"
          }`}
        >
          오래된순
        </button>
      </div>

      {isPending && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <LpCardSkeleton key={index} />
          ))}
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center gap-4">
          <p className="text-red-400">데이터를 불러오지 못했습니다.</p>
        </div>
      )}

      {!isPending && !isError && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {lps.map((lp) => (
            <LpCard key={lp.id} lp={lp} />
          ))}
        </div>
      )}

      <div ref={ref} className="h-10 mt-6" />

      {isFetching && !isPending && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <LpCardSkeleton key={index} />
          ))}
        </div>
      )}

    </div>
  );
};

export default HomePage;