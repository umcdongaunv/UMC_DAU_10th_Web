import useCustomFetch from "../hooks/useCustomFetch";
import MovieCard from "../components/MovieCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useParams } from "react-router-dom";
import { useState } from "react";
import type { MovieResponse } from "../types/movie";

export default function MoviePage() {
  const [page, setPage] = useState(1);
  const { category } = useParams<{ category: string }>();

  const { data, isLoading, isError } = useCustomFetch<MovieResponse>(
    `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`
  );

  if (isError) {
    return (
      <div className="flex flex-col items-center mt-10">
        <h1 className="text-red-500 text-2xl font-bold">
          영화를 불러오는 중 에러가 발생.
        </h1>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-center gap-6 mt-5">
        <button
          className="bg-black  text-white px-6 py-3 rounded-md font-bold shadow-lg hover:bg-[#ff1e2b] transition-all duration-200 disabled:bg-[#333] disabled:text-[#777] cursor-pointer disabled:cursor-not-allowed"
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          {`<`}
        </button>

        <span className="text-black font-black text-xl tracking-widest">
          {page} <span className="text-black">/</span> PAGE
        </span>

        <button
          className="bg-black text-white px-6 py-3 rounded-md font-bold shadow-lg hover:bg-[#ff1e2b] transition-all duration-200 cursor-pointer"
          onClick={() => setPage((prev) => prev + 1)}
        >
          {`>`}
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-dvh">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {data?.results.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </>
  );
}