import { useParams } from "react-router-dom";

export default function PremiumWebtoon() {
  const { id } = useParams();

  return (
    <div className="container">
      <h1>📚 프리미엄 웹툰 {id}번</h1>
      <p>이 콘텐츠는 프리미엄 사용자 전용입니다.</p>
    </div>
  );
}