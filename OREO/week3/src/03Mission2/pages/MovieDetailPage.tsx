import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import type { MovieDetail, Credits } from "../types/movie";
import { LoadingSpinner } from "../components/LoadingSpinner";

export const MovieDetailPage = () => {
  // URL에서 movieId 추출
  const { movieId } = useParams<{ movieId: string }>();

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setIsPending(true);
      try {
        // 영화 상세 정보 + 크레딧 동시 요청
        const [movieRes, creditsRes] = await Promise.all([
          axios.get<MovieDetail>(
            `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
            { headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}` } }
          ),
          axios.get<Credits>(
            `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
            { headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}` } }
          ),
        ]);
        setMovie(movieRes.data);
        setCredits(creditsRes.data);
        setIsError(false);
      } catch {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchDetail();
  }, [movieId]);

  // 로딩 중
  if (isPending) {
    return (
      <div className="flex items-center justify-center h-dvh">
        <LoadingSpinner />
      </div>
    );
  }

  // 에러 발생
  if (isError) {
    return (
      <div className="flex items-center justify-center h-dvh">
        <span className="text-red-500 text-2xl font-bold">
          에러가 발생했습니다.
        </span>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* 배경 + 포스터 */}
      <div className="relative w-full h-64 rounded-xl overflow-hidden mb-8">
        <img
          src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="flex gap-8">
        {/* 포스터 */}
        <img
          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
          alt={movie.title}
          className="w-44 rounded-xl shadow-lg shrink-0"
        />

        {/* 상세 정보 */}
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold">{movie.title}</h1>
          <p className="text-gray-500 text-sm">{movie.release_date} · {movie.runtime}분</p>

          {/* 장르 */}
          <div className="flex gap-2 flex-wrap">
            {movie.genres.map((g) => (
              <span key={g.id} className="bg-[#b2dab1] text-white text-xs px-3 py-1 rounded-full">
                {g.name}
              </span>
            ))}
          </div>

          {/* 평점 */}
          <p className="text-yellow-500 font-bold text-lg">
            ⭐ {movie.vote_average.toFixed(1)}
          </p>

          {/* 줄거리 */}
          <p className="text-gray-700 leading-relaxed text-sm">{movie.overview}</p>
        </div>
      </div>

      {/* 출연진 */}
      {credits && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">출연진</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {credits.cast.slice(0, 10).map((actor) => (
              <div key={actor.id} className="shrink-0 w-24 text-center">
                <img
                  src={
                    actor.profile_path
                      ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                      : "https://placehold.co/100x150?text=No+Image"
                  }
                  alt={actor.name}
                  className="w-24 h-32 object-cover rounded-lg shadow"
                />
                <p className="text-xs font-bold mt-1">{actor.name}</p>
                <p className="text-xs text-gray-500">{actor.character}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
