import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <main className="page">
      <h1>홈</h1>
      <p>UMC 5주차 미션1 — Protected Route 데모입니다.</p>
      <p>
        프리미엄 웹툰 페이지(<code>/premium/webtoon/:id</code>)는
        로그인한 유저만 접근할 수 있어요.
      </p>
      <div className="cta">
        <Link to="/premium/webtoon/1" className="btn primary">
          🔒 프리미엄 웹툰 1편 보러가기
        </Link>
        <Link to="/login" className="btn ghost">
          로그인 페이지로
        </Link>
      </div>
    </main>
  )
}
