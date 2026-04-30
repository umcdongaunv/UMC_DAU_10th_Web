import { useEffect, useState } from "react";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
}

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    fetch("https://api.themoviedb.org/3/movie/popular?api_key=ed96fffafecf17abd439e4b66b6214ae")
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.results || []);
      });
  }, []);

  return (
    <div className="grid grid-cols-5 gap-4 p-4">
      {movies.map((movie) => (
        <div
          key={movie.id}
          className="relative group overflow-hidden rounded-lg"
        >
          {/* 포스터 */}
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:blur-md transition duration-300"
          />

          {/* 오버레이 (투명도 낮춤) */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 text-white p-3 transition duration-300">
            <h2 className="text-lg font-bold">{movie.title}</h2>
            <p className="text-sm mt-2 line-clamp-4">
              {movie.overview}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}