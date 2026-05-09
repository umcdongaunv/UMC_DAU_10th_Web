import { useParams } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import useCustomFetch from "../hooks/useCustomFetch";

export default function MovieDetailPage() {
    const { movieId } = useParams<{ movieId: string }>();

   const { data: credits, isLoading: isCreditsLoading, isError: isCreditsError } = 
        useCustomFetch<any>(`https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`);

    const { data: movie, isLoading: isMovieLoading, isError: isMovieError } = 
        useCustomFetch<any>(`https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`);


    if (isMovieLoading || isCreditsLoading) return <div className='flex justify-center items-center h-dvh'><LoadingSpinner /></div>;
    if (isMovieError || isCreditsError || !movie) return <div className='text-red-500 p-10 font-bold'>영화를 불러오는 중 에러 발생</div>;

    return (
        <div className="bg-black text-white min-h-screen">
            <div 
                className="relative h-112.5 bg-cover bg-center" 
                style={{ backgroundImage: `radial-gradient(circle at left center, rgba(0,0,0,1) 15%, rgba(0,0,0,0) 75%), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
            >
                <div className="p-10 flex flex-col justify-center h-full max-w-4xl">
                    <h1 className="text-5xl font-extrabold mb-4">{movie.title}</h1>
                    <div className="flex gap-4 text-sm mb-4 text-gray-300">
                        <span>★ {movie.vote_average.toFixed(1)}</span>
                        <span>{movie.release_date.split('-')[0]}</span>
                        <span>{movie.runtime}분</span>
                    </div>
                    <p className="max-w-2xl text-gray-200 leading-relaxed line-clamp-5">{movie.overview}</p>
                </div>
            </div>

            <div className="p-10">
                <h2 className="text-2xl font-bold mb-8">감독/출연</h2>
                <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-6">
                    {credits?.cast.slice(0, 20).map((person: any) => (
                        <div key={person.id} className="flex flex-col items-center">
                            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-800 mb-2">
                                <img className="w-full h-full object-cover" src={person.profile_path ? `https://image.tmdb.org/t/p/w185${person.profile_path}` : 'https://placehold.jp/100x100'} alt={person.name} />
                            </div>
                            <p className="text-[11px] font-semibold text-center truncate w-full">{person.name}</p>
                            <p className="text-[9px] text-gray-500 text-center truncate w-full">{person.character}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}