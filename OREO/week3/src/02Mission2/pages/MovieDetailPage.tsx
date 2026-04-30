import { useParams } from "react-router-dom";

export const MovieDetailPage = () => {
  // URL에서 movieId 파라미터 추출
  const { movieId } = useParams();

  return <div>MovieDetailPage: {movieId}</div>;
};
