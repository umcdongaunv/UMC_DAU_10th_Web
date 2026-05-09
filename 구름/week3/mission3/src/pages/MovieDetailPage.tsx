import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Movie, CastMember } from "../types/movie";

const API_KEY = "ed96fffafecf17abd439e4b66b6214ae";
const BASE_URL = "https://api.themoviedb.org/3";

const MovieDetailPage = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [movieRes, castRes] = await Promise.all([
          fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=ko-KR`),
          fetch(`${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}&language=ko-KR`)
        ]);

        const movieData = await movieRes.json();
        const castData = await castRes.json();

        setMovie(movieData);
        setCast(castData.cast.slice(0, 6));
      } catch (err) {
        console.error("데이터 로딩 실패", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [movieId]);

  if (loading) return <div className="text-white text-center mt-20">데이터를 가져오는 중...</div>;
  if (!movie) return <div className="text-white text-center mt-20">영화를 찾을 수 없습니다.</div>;

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      {/* 히어로 배너 섹션 */}
      <div 
        className="relative h-[500px] w-full bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(to bottom, rgba(20,20,20,0) 0%, rgba(20,20,20,1) 100%), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
      >
        <div className="absolute bottom-10 left-10 flex gap-8 items-end">
          <img 
            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} 
            className="w-48 rounded-lg shadow-2xl hidden md:block" 
            alt="poster"
          />
          <div>
            <h1 className="text-5xl font-black mb-4">{movie.title}</h1>
            <p className="text-lg text-gray-300 max-w-2xl line-clamp-3">{movie.overview}</p>
          </div>
        </div>
      </div>

      {/* 출연진 섹션 */}
      <div className="p-10">
        <h2 className="text-2xl font-bold mb-6">주요 출연진</h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {cast.map(person => (
            <div key={person.id} className="bg-[#2f2f2f] p-2 rounded-lg text-center">
              <img 
                src={person.profile_path ? `https://image.tmdb.org/t/p/w185${person.profile_path}` : "https://via.placeholder.com/185x278"} 
                className="rounded mb-2 w-full object-cover aspect-[2/3]"
                alt={person.name}
              />
              <p className="text-sm font-bold truncate">{person.name}</p>
              <p className="text-xs text-gray-400 truncate">{person.character}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;