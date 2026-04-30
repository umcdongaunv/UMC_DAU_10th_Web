import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { LoadingSpinner } from "../components/LoadingSpinner";

interface MovieDetail {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  runtime: number;
}

interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}

export default function MovieDetailPage() {
  // 1. URL에서 movieId 추출
  const { movieId } = useParams<{ movieId: string }>();

  // 2. 상태 관리
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [isPending, setIsPending] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      setIsPending(true);
      setIsError(false);

      try {
        const commonConfig = {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
          },
        };

        // 상세 정보와 출연진 정보를 동시에 호출 (Promise.all 사용)
        const [detailRes, creditsRes] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`, commonConfig),
          axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`, commonConfig),
        ]);

        setMovie(detailRes.data);
        setCast(creditsRes.data.cast);
      } catch (error) {
        setIsError(true);
        console.error(error);
      } finally {
        setIsPending(false);
      }
    };

    if (movieId) fetchMovieDetail();
  }, [movieId]);

  if (isPending) return <div className='flex justify-center items-center h-dvh'><LoadingSpinner /></div>;
  if (isError || !movie) return <div className='text-red-500 p-10'>데이터를 불러오는 중 오류가 발생했습니다.</div>;

  return (
    <div className="bg-[#0b0d14] text-white min-h-screen">
      {/* 1. 상단 배경 및 상세 정보 섹션 */}
      <div 
        className="relative h-100 bg-cover bg-center" 
        style={{ backgroundImage: `linear-gradient(to left, rgba(0,0,0,0.1), #0b0d14), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
      >
        <div className="p-10 flex flex-col justify-center h-full max-w-4xl">
          <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
          <p className="text-lg mb-1">평균 ★{movie.vote_average.toFixed(1)}</p>
          <p className="text-gray-300">{movie.release_date.split('-')[0]} · {movie.runtime}분</p>
          <p className="mt-5 max-w-2xl text-gray-200 leading-relaxed">{movie.overview}</p>
        </div>
      </div>

      {/* 2. 감독/출연진 섹션 (이미지에 있던 동그란 프로필 리스트) */}
      <div className="p-10">
        <h2 className="text-2xl font-bold mb-6">감독/출연</h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 gap-6">
          {cast.slice(0, 18).map((person) => (
            <div key={person.id} className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white mb-2">
                <img 
                  className="w-full h-full object-cover"
                  src={person.profile_path ? `https://image.tmdb.org/t/p/w185${person.profile_path}` : 'https://placehold.jp/80'} 
                  alt={person.name} 
                />
              </div>
              <p className="text-xs font-semibold text-center truncate w-full">{person.name}</p>
              <p className="text-[10px] text-gray-400 text-center truncate w-full">{person.character}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}