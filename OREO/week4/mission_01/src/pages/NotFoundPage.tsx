import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-dvh gap-4">
      <h1 className="text-4xl font-bold text-gray-800">404</h1>
      <p className="text-gray-500">페이지를 찾을 수 없습니다.</p>
      <Link to="/" className="text-[#b2dab1] font-bold hover:underline">
        홈으로 돌아가기
      </Link>
    </div>
  );
}
