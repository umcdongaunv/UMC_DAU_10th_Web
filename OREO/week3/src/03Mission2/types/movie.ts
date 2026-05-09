export type Movie = {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export type MovieResponse = {
  page: number;
  results: Movie[];
  totalPages: number;
  total_results: number;
}

// 영화 상세 정보 타입
export interface MovieDetail {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  runtime: number;
  genres: { id: number; name: string }[];
}

// 출연진/제작진 타입
export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Credits {
  cast: Cast[];
}
