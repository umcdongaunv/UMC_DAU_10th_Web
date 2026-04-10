import { useNavigate } from 'react-router-dom';
import useCustomFetch from '../hooks/useCustomFetch';

const MovieList = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useCustomFetch<any>('https://api.themoviedb.org/3/movie/popular?language=ko-KR');

  if (isLoading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">로딩 중이다...</div>; // 로딩 처리
  if (isError) return <div className="min-h-screen bg-black text-red-500 flex items-center justify-center">{isError}</div>; // 에러 처리

  return (
    <div className="bg-black min-h-screen p-10">
      <h1 className="text-4xl font-extrabold text-white mb-10 text-center">인기 영화</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {data?.results?.map((movie: any) => (
          <div 
            key={movie.id} 
            onClick={() => navigate(`/movies/${movie.id}`)}
            className="cursor-pointer group relative bg-gray-900 rounded-xl overflow-hidden hover:scale-105 transition-transform"
          >
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="w-full h-auto" />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity flex items-center justify-center p-4">
              <p className="text-white opacity-0 group-hover:opacity-100 text-center font-bold">{movie.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieList;