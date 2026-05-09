import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import type { Movie, MovieResponse } from "../types/movie";
import MovieCard from "../components/MovieCard";
import { LoadingSpinner } from "../components/LoadingSpinner";

export default function MoviePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  // 로딩 상태
  const [isPending, setIsPending] = useState(false);
  // 에러 상태
  const [isError, setIsError] = useState(false);
  // 현재 페이지 번호 (초기값 1)
  const [page, setPage] = useState(1);

  // URL에서 category 파라미터 추출 (popular, upcoming 등)
  const { category } = useParams<{ category: string }>();

  // page 또는 category 변경될 때마다 API 재호출
  useEffect(() => {
    const fetchMovies = async () => {
      setIsPending(true);

      try {
        const { data } = await axios.get<MovieResponse>(
          `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );
        setMovies(data.results);
        setIsError(false); // 성공 시 에러 상태 초기화
      } catch {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchMovies();
  }, [page, category]);

  // 에러 발생 시 에러 메시지 표시
  if (isError) {
    return (
      <div>
        <span className="text-red-500 text-2xl font-bold">
          에러가 발생했습니다.
        </span>
      </div>
    );
  }

  return (
    <>
      {/* 페이지네이션 버튼 */}
      <div className="flex items-center justify-center gap-6 mt-5">
        <button
          className="bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md
          hover:bg-[#b2dab1] transition-all duration-200 disabled:bg-gray-300
          cursor-pointer disabled:cursor-not-allowed"
          disabled={page === 1} // 1페이지면 이전 버튼 비활성화
          onClick={() => setPage((prev) => prev - 1)}
        >
          {"<"}
        </button>

        <span>{page} Page</span>

        <button
          className="bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md
          hover:bg-[#b2dab1] transition-all duration-200 cursor-pointer"
          onClick={() => setPage((prev) => prev + 1)}
        >
          {">"}
        </button>
      </div>

      {/* 로딩 중일 때 스피너 표시 */}
      {isPending && (
        <div className="flex items-center justify-center h-dvh">
          <LoadingSpinner />
        </div>
      )}

      {/* 로딩 완료 시 영화 목록 표시 */}
      {!isPending && (
        <div className="p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4
        lg:grid-cols-5 xl:grid-cols-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </>
  );
}
