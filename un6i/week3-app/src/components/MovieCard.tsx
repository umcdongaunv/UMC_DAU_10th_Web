import type { Movie } from "../types/movie";
import { Link } from "react-router-dom";

interface Props {
  movie: Movie;
}

const MovieCard = ({ movie }: Props) => {
  return (
    <Link to={`/movies/${movie.id}`}>
      <div className="bg-white shadow-xl rounded-xl overflow-hidden hover:scale-105 transition">
        <img
          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-[350px] object-cover"
        />
        <div className="p-3">
          <h2 className="font-bold truncate">{movie.title}</h2>
          <p className="text-sm text-gray-500">{movie.release_date}</p>
          <p>⭐ {movie.vote_average}</p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;