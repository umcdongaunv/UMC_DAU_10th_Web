import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'

export default function Home() {
  const { status, user } = useAuth()
  return (
    <main className="page">
      <h1>홈</h1>
      <p>UMC 5주차 미션2 — Refresh Token으로 지속 로그인 유지</p>
      {status === 'authenticated' ? (
        <p>
          <strong>{user?.name}</strong> 님으로 로그인 됨. Access token이 만료되어도
          axios interceptor가 자동으로 refresh + 재시도 합니다.
        </p>
      ) : (
        <p>아직 로그인하지 않았어요.</p>
      )}
      <div className="cta">
        <Link to="/premium/webtoon/1" className="btn primary">
          🔒 프리미엄 웹툰 보러가기
        </Link>
        <Link to="/login" className="btn ghost">
          로그인 페이지로
        </Link>
      </div>
    </main>
  )
}
