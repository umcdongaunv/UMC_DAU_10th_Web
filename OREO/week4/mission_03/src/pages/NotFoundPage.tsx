export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-4 p-8">
      <h1 className="text-6xl font-bold text-[var(--text-h)]">404</h1>
      <p className="text-xl text-[var(--text)]">페이지를 찾을 수 없습니다.</p>
      <a href="/signup" className="text-purple-500 hover:underline">
        회원가입으로 돌아가기
      </a>
    </div>
  );
}
