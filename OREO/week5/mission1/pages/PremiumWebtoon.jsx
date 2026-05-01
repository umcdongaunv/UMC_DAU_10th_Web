import { useNavigate, useParams } from 'react-router-dom'

export default function PremiumWebtoon() {
  const { id } = useParams()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    navigate('/login', { replace: true })
  }

  return (
    <main className="page">
      <h1>🔒 프리미엄 웹툰 #{id}</h1>
      <p>프리미엄 결제를 마친 회원만 볼 수 있는 컨텐츠예요.</p>

      <article className="webtoon">
        <h2>오늘의 에피소드</h2>
        <p className="quote">"Protected Route를 부수려는 자, 로그인하라."</p>
        <p>
          이 페이지에 접근할 수 있다는 건, ProtectedRoute가 정상적으로
          토큰을 확인했다는 뜻이에요. 로그아웃 후 다시 들어와보면
          /login 으로 리다이렉트되는 걸 확인할 수 있습니다.
        </p>
      </article>

      <button className="btn ghost" onClick={handleLogout}>
        로그아웃
      </button>
    </main>
  )
}
