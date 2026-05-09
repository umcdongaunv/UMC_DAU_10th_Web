/* 
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Movie } from '../types/movie';
import MovieCard from "../components/MovieCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import useCustomFetch from "../hooks/useCustomFetch";

interface MovieResponse {
    results: Movie[];
}

export default function MoviePage() {
    const [page, setPage] = useState(1);
    const { category } = useParams<{ category: string }>();
    const { data, isLoading, isError } = useCustomFetch<MovieResponse>(
        `/movie/${category}?language=ko-KR&page=${page}`
    );

    if (isError) return (
        <div className="flex h-screen bg-white items-center justify-center">
            <span className="text-red-500 text-2xl font-bold">데이터 로딩 에러 발생</span>
        </div>
    );

    return (
        <div className="bg-white min-h-screen">
            <nav className="flex justify-center gap-8 py-6 border-b border-gray-200 bg-white sticky top-0 z-10">
                <Link to="/" className="text-gray-800 font-bold hover:text-[#dda5e3]">홈</Link>
                <Link to="/movies/popular" className="text-gray-800 font-bold hover:text-[#dda5e3]">인기 영화</Link>
                <Link to="/movies/now_playing" className="text-gray-800 font-bold hover:text-[#dda5e3]">현재 상영중</Link>
                <Link to="/movies/top_rated" className="text-gray-800 font-bold hover:text-[#dda5e3]">높은 평점</Link>
                <Link to="/movies/upcoming" className="text-gray-800 font-bold hover:text-[#dda5e3]">개봉 예정</Link>
            </nav>

            <div className="flex items-center justify-center gap-6 py-6 text-gray-800">
                <button 
                    className="bg-[#dda5e3] text-white px-6 py-2 rounded-lg disabled:opacity-50"
                    disabled={page === 1} 
                    onClick={() => setPage(prev => prev - 1)}
                >
                    이전
                </button>
                <span className="text-lg font-bold">{page} 페이지</span>
                <button 
                    className="bg-[#dda5e3] text-white px-6 py-2 rounded-lg"
                    onClick={() => setPage(prev => prev + 1)}
                >
                    다음
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-[50vh]"><LoadingSpinner /></div>
            ) : (
                <div className="p-10 grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {data?.results.map(movie => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            )}
        </div>
    );
} 
*/