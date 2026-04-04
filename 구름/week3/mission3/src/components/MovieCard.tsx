import { useState } from 'react';
import type { Movie } from '../types/movie';
import { useNavigate } from 'react-router-dom';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/movie/${movie.id}`)}
      className='relative rounded-xl shadow-lg overflow-hidden cursor-pointer w-44 transition-transform duration-300 hover:scale-105'
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
        alt={movie.title}
        className='w-full h-full object-cover'
      />

      {isHovered && (
        <div className='absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col justify-end p-4 text-white transition-opacity duration-300'>
          <h2 className='text-sm font-bold'>{movie.title}</h2>
          <p className='text-[10px] text-gray-300 line-clamp-3 mt-1'>{movie.overview}</p>
        </div>
      )}
    </div>
  );
}