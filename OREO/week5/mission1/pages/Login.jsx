import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem('accessToken')),
  )

  const handleLogin = () => {
    localStorage.setItem('accessToken', 'demo-access-token')
    setIsLoggedIn(true)
    const redirectTo = location.state?.from?.pathname ?? '/'
    navigate(redirectTo, { replace: true })
  }

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    setIsLoggedIn(false)
  }

  return (
    <main className="page">
      <h1>로그인</h1>
      {isLoggedIn ? (
        <>
          <p>이미 로그인된 상태입니다.</p>
          <button className="btn ghost" onClick={handleLogout}>
            로그아웃
          </button>
        </>
      ) : (
        <>
          <p>아래 버튼을 누르면 데모용 토큰이 localStorage에 저장됩니다.</p>
          <button className="btn primary" onClick={handleLogin}>
            로그인하기
          </button>
        </>
      )}
    </main>
  )
}
