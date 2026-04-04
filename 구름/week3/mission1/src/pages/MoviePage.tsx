import { useEffect, useState } from "react"
import axios from "axios";
import type { Movie, MovieResponse } from '../types/movie'
import MovieCard from "../components/MovieCard";

export default function MoviePage() {
    const [movies, setMovies] = useState<Movie[]>([]);

    useEffect(() => {
        const fetchMovies = async () => {
            const {data} = await axios.get<MovieResponse>('https://api.themoviedb.org/3/movie/popular?api_key=e74ed7da537caf0680777e91d534a66c',
                {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`
                    }
                }
            );
            

            setMovies(data.results);
        }

        fetchMovies();
    }, []);

    console.log(movies[0]?.adult);

    return (
        <div className="p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cools-6">
            {movies && movies?.map((movie) => (
                <MovieCard key={movie.id} movie={movie}/>
            ))}
        </div>
    )
}