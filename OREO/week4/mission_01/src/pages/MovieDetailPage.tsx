import { useParams } from "react-router-dom";
import type { MovieDetail, Credits } from "../types/movie";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useCustomFetch } from "../hooks/useCustomFetch";

export const MovieDetailPage = () => {
  const { movieId } = useParams<{ movieId: string }>();

  const {
    data: movie,
    isPending: moviePending,
    isError: movieError,
  } = useCustomFetch<MovieDetail>(
    `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`
  );

  const {
    data: credits,
    isPending: creditsPending,
    isError: creditsError,
  } = useCustomFetch<Credits>(
    `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`
  );

  const isPending = moviePending || creditsPending;
  const isError = movieError || creditsError;

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-dvh">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-dvh">
        <div className="text-center">
          <p className="text-red-500 text-2xl font-bold mb-2">
            😢 영화 정보를 불러올 수 없어요
          </p>
          <p className="text-gray-500 text-sm">
            네트워크 연결을 확인하거나 잠시 후 다시 시도해 주세요.
          </p>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="relative w-full h-64 rounded-xl overflow-hidden mb-8">
        <img
          src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <h1 className="absolute bottom-4 left-4 text-white text-3xl font-bold drop-shadow">
          {movie.title}
        </h1>
      </div>

      <div className="flex gap-8">
        <img
          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
          alt={movie.title}
          className="w-44 rounded-xl shadow-lg shrink-0"
        />

        <div className="flex flex-col gap-3">
          <p className="text-gray-500 text-sm">
            {movie.release_date} · {movie.runtime}분
          </p>

          <div className="flex gap-2 flex-wrap">
            {movie.genres.map((g) => (
              <span
                key={g.id}
                className="bg-[#b2dab1] text-white text-xs px-3 py-1 rounded-full"
              >
                {g.name}
              </span>
            ))}
          </div>

          <p className="text-yellow-500 font-bold text-lg">
            ⭐ {movie.vote_average.toFixed(1)}
          </p>

          <p className="text-gray-700 leading-relaxed text-sm">
            {movie.overview || "줄거리 정보가 없습니다."}
          </p>
        </div>
      </div>

      {credits && credits.cast.length > 0 && (
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
