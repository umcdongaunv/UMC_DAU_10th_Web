import { useState } from "react";
import { useParams } from "react-router-dom";
import type { Movie, MovieResponse } from "../types/movie";
import MovieCard from "../components/MovieCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useCustomFetch } from "../hooks/useCustomFetch";

export default function MoviePage() {
  const [page, setPage] = useState(1);
  const { category } = useParams<{ category: string }>();

  const { data, isPending, isError } = useCustomFetch<MovieResponse>(
    `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`
  );

  const movies: Movie[] = data?.results ?? [];

  if (isError) {
    return (
      <div className="flex items-center justify-center h-dvh">
        <div className="text-center">
          <p className="text-red-500 text-2xl font-bold mb-2">
            😢 데이터를 불러올 수 없어요
          </p>
          <p className="text-gray-500 text-sm">
            네트워크 연결을 확인하거나 잠시 후 다시 시도해 주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-center gap-6 mt-6">
        <button
          className="bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md
          hover:bg-[#b2dab1] transition-all duration-200 disabled:bg-gray-300
          cursor-pointer disabled:cursor-not-allowed"
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          {"<"}
        </button>

        <span className="font-semibold text-gray-700">{page} Page</span>

        <button
          className="bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md
          hover:bg-[#b2dab1] transition-all duration-200 cursor-pointer"
          onClick={() => setPage((prev) => prev + 1)}
        >
          {">"}
        </button>
      </div>

      {isPending && (
        <div className="flex items-center justify-center h-dvh">
          <LoadingSpinner />
        </div>
      )}

      {!isPending && (
        <div className="p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4
        lg:grid-cols-5 xl:grid-cols-6 justify-items-center">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </>
  );
}
