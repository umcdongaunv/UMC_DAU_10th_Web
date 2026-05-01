import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './auth/AuthContext.jsx'

export default function ProtectedRoute({ children }) {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return (
      <main className="page">
        <p>인증 정보를 확인하는 중…</p>
      </main>
    )
  }
  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return children
}
