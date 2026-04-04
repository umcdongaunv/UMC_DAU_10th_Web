import { useEffect, useState } from "react";
import axios from "axios";
import type { Movie, MovieResponse } from "../type/movie"; // types → type
import MovieCard from "../components/MovieCard";

export default function MoviePage() {
  // 영화 데이터를 저장할 상태
  const [movies, setMovies] = useState<Movie[]>([]);

  // 컴포넌트가 처음 마운트될 때 한 번만 API 호출
  useEffect(() => {
    const fetchMovies = async () => {
      // axios로 TMDB 인기 영화 데이터 요청
      // .env에 저장된 토큰을 Authorization 헤더에 담아 전송
      const { data } = await axios.get<MovieResponse>(
        `https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`
          },
        }
      );
      setMovies(data.results);
    };

    fetchMovies();
  }, []); // 빈 배열 → 마운트 시 한 번만 실행

  console.log(movies); // 데이터 확인용

  return (
    <div className="p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4
    lg:grid-cols-5 xl:grid-cols-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}