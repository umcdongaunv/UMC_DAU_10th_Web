import { useEffect, useState } from "react";
import type { Movie } from "../types/movie";
import MovieCard from "./MovieCard";

const API_KEY = "ed96fffafecf17abd439e4b66b6214ae";
const BASE_URL = "https://api.themoviedb.org/3";

const MovieList = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=ko&page=1`
        );

        if (!res.ok) throw new Error("API 오류");

        const data = await res.json();
        setMovies(data.results as Movie[]); // ⭐ 타입 캐스팅
      } catch (err) {
        setError("영화 목록을 불러오는 데 실패했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
};

export default MovieList;