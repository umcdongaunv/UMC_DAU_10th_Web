import { useEffect, useState } from "react";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

export default function Popular() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const API_KEY = "ed96fffafecf17abd439e4b66b6214ae";

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=ko-KR&page=${page}`
        );

        if (!res.ok) throw new Error("데이터 가져오기 실패");

        const data = await res.json();
        setMovies(data.results);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [page]);

  if (isLoading) return <p>로딩중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>인기 영화</h1>

      {/* ✅ 페이지네이션 (위에 중앙 정렬) */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={() => setPage((p) => p - 1)}
          disabled={page === 1}
          style={{ padding: "8px 12px" }}
        >
          &lt;
        </button>

        <span>{page}페이지</span>

        <button
          onClick={() => setPage((p) => p + 1)}
          style={{ padding: "8px 12px" }}
        >
          &gt;
        </button>
      </div>

      {/* ✅ 영화 카드 그리드 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: "20px",
        }}
      >
        {movies.map((movie) => (
          <div key={movie.id}>
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.title}
              style={{
                width: "100%",
                borderRadius: "10px",
              }}
            />
            <p style={{ textAlign: "center" }}>{movie.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}