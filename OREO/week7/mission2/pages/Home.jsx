import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'

export default function Home() {
  const { status, user } = useAuth()
  return (
    <main className="page">
      <h1>홈</h1>
      <p>UMC 7주차 미션2 — 낙관적 업데이트 (Optimistic Update) · 닉네임 + 좋아요</p>
      {status === 'authenticated' ? (
        <p>
          <strong>{user?.name}</strong> 님으로 로그인 됨.
        </p>
      ) : (
        <p>아직 로그인하지 않았어요.</p>
      )}
      <div className="cta">
        <Link to="/webtoons" className="btn primary">
          📚 LP 둘러보기
        </Link>
        <Link to="/my" className="btn ghost">
          👤 마이 페이지
        </Link>
      </div>
      <p className="muted small" style={{ marginTop: 16 }}>
        💡 미션 2: 마이페이지에서 닉네임을 바꾸거나 LP 상세에서 좋아요를 눌러보세요. 서버 응답(700~800ms)을 기다리지 않고 화면이 즉시 반응합니다.
      </p>
    </main>
  )
}
