export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}