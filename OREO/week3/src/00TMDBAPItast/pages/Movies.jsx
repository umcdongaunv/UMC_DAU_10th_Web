import { useEffect, useState } from 'react'
import axios from 'axios'

const MoviesPage = () => {
  const [movies, setMovies] = useState([])

  useEffect(() => {
    const fetchMovies = async () => {
      const { data } = await axios.get(
        'https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1',
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYmZmMWYyMzUwNWMwMGU4OGUwMTYwYzI1YjRjMDlmZiIsIm5iZiI6MTc3NTI1OTYyNC45MjgsInN1YiI6IjY5ZDA0ZmU4NmZlODFkNzRiOGE2NDcyZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3UUWzEn8C1lY68pnulQzfxKF3jnOiA2-3AjlsW6lYK0`
          }
        }
      )
      setMovies(data.results)
    }
    fetchMovies()
  }, [])

  return (
    <ul>
      {movies?.map((movie) => (
        <li key={movie.id}>
          <h2>{movie.title}</h2>
          <p>{movie.release_date}</p>
        </li>
      ))}
    </ul>
  )
}

export default MoviesPage