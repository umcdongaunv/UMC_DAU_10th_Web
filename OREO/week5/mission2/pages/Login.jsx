import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'

const DEMO = { email: 'umc@umc.com', password: '1234' }

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { status, user, login, logout } = useAuth()

  const [email, setEmail] = useState(DEMO.email)
  const [password, setPassword] = useState(DEMO.password)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login({ email, password })
      const redirectTo = location.state?.from?.pathname ?? '/'
      navigate(redirectTo, { replace: true })
    } catch (err) {
      const msg = err.response?.data?.message ?? err.message ?? '로그인 실패'
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  if (status === 'authenticated') {
    return (
      <main className="page">
        <h1>로그인</h1>
        <p>
          이미 <strong>{user?.name ?? user?.email}</strong> 으로 로그인되어 있어요.
        </p>
        <button className="btn ghost" onClick={logout}>
          로그아웃
        </button>
      </main>
    )
  }

  return (
    <main className="page">
      <h1>로그인</h1>
      <p>데모 계정 자동 입력. 그대로 로그인 누르면 됩니다.</p>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          이메일
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </label>
        <label>
          비밀번호
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>
        {error && <p className="error">⚠ {error}</p>}
        <button type="submit" className="btn primary" disabled={submitting}>
          {submitting ? '로그인 중…' : '로그인'}
        </button>
      </form>
    </main>
  )
}
