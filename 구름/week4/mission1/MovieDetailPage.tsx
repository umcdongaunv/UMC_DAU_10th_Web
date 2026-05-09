/* 
import { useParams } from "react-router-dom";
import type { Movie, CastMember } from "../types/movie";
import useCustomFetch from "../hooks/useCustomFetch";
import { LoadingSpinner } from "../components/LoadingSpinner";

interface CastResponse {
    cast: CastMember[];
}

const MovieDetailPage = () => {
    const { movieId } = useParams<{ movieId: string }>();
    const { data: movie, isLoading: mLoading, isError: mError } = useCustomFetch<Movie>(`/movie/${movieId}?language=ko-KR`);
    const { data: castData, isLoading: cLoading } = useCustomFetch<CastResponse>(`/movie/${movieId}/credits?language=ko-KR`);

    if (mLoading || cLoading) return <div className="flex justify-center items-center h-screen bg-[#141414]"><LoadingSpinner /></div>;
    if (mError || !movie) return <div className="text-white text-center mt-20 font-bold">정보를 불러올 수 없습니다.</div>;

    return (
        <div className="min-h-screen bg-[#141414] text-white">
            <div 
                className="relative h-[550px] w-full bg-cover bg-center"
                style={{ backgroundImage: `linear-gradient(to bottom, transparent, #141414), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
            >
                <div className="absolute bottom-10 left-10 flex gap-8 items-end p-4">
                    <img 
                        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} 
                        className="w-52 rounded-xl shadow-2xl hidden md:block border border-gray-700" 
                        alt="poster"
                    />
                    <div className="max-w-3xl">
                        <h1 className="text-6xl font-black mb-6 tracking-tighter">{movie.title}</h1>
                        <div className="flex items-center gap-4 mb-4 text-yellow-400 font-bold">
                            <span>평점{movie.vote_average.toFixed(1)}</span>
                            <span className="text-gray-400">|</span>
                            <span>{movie.release_date}</span>
                        </div>
                        <p className="text-lg text-gray-300 leading-relaxed line-clamp-4">{movie.overview}</p>
                    </div>
                </div>
            </div>

            <div className="p-10 max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold mb-10 border-l-4 border-[#dda5e3] pl-4">주요 출연진</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8">
                    {castData?.cast.slice(0, 6).map(person => (
                        <div key={person.id} className="group cursor-pointer">
                            <div className="overflow-hidden rounded-2xl mb-4 border border-gray-800 group-hover:border-[#dda5e3] transition-all">
                                <img 
                                    src={person.profile_path ? `https://image.tmdb.org/t/p/w185${person.profile_path}` : "https://via.placeholder.com/185x278"} 
                                    className="w-full aspect-[2/3] object-cover group-hover:scale-110 transition-transform duration-500"
                                    alt={person.name}
                                />
                            </div>
                            <p className="font-bold truncate">{person.name}</p>
                            <p className="text-sm text-gray-500 truncate">{person.character}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MovieDetailPage;
 */