import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Movie, CastMember } from "../types/movie";

const API_KEY = "ed96fffafecf17abd439e4b66b6214ae";
const BASE_URL = "https://api.themoviedb.org/3";

const MovieDetail = () => {
  const { movieId } = useParams<{ movieId: string }>();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        if (!movieId) return;

        const movieRes = await fetch(
          `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=ko`
        );
        if (!movieRes.ok) throw new Error("상세 실패");
        const movieData = await movieRes.json();

        const creditsRes = await fetch(
          `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}&language=ko`
        );
        if (!creditsRes.ok) throw new Error("크레딧 실패");
        const creditsData = await creditsRes.json();

        setMovie(movieData as Movie);
        setCast((creditsData.cast || []).slice(0, 6) as CastMember[]);
      } catch (err) {
        setError("데이터를 불러오는데 실패했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [movieId]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!movie) return <div className="text-center mt-10">Movie not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="rounded-lg shadow-lg"
        />
        <div>
          <h1 className="text-2xl font-bold">{movie.title}</h1>
          <p className="text-gray-600">
            {movie.release_date} | ⭐ {movie.vote_average}
          </p>
          <p className="mt-3">{movie.overview}</p>

          <h2 className="mt-5 font-semibold">출연진</h2>
          <div className="flex gap-3 flex-wrap">
            {cast.map((c) => (
              <div key={c.id} className="w-20">
                <img
                  src={`https://image.tmdb.org/t/p/w200${c.profile_path}`}
                  className="rounded"
                />
                <p className="text-xs">{c.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;