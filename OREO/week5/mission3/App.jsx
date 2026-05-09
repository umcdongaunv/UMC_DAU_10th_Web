import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom'
import { AuthProvider, useAuth } from './auth/AuthContext.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import PremiumWebtoon from './pages/PremiumWebtoon.jsx'
import GoogleCallback from './pages/GoogleCallback.jsx'
import './App.css'

function NotFound() {
  return (
    <main className="page">
      <h1>404</h1>
      <p>페이지를 찾을 수 없어요.</p>
      <Link to="/">홈으로</Link>
    </main>
  )
}

function HeaderUser() {
  const { status, user, logout } = useAuth()
  if (status !== 'authenticated') return null
  return (
    <div className="user-area">
      <span className="user-name">{user?.name ?? user?.email}</span>
      <button className="btn ghost small" onClick={logout}>
        로그아웃
      </button>
    </div>
  )
}

function Layout({ children }) {
  return (
    <div className="app">
      <header className="header">
        <h2 className="brand">📚 UMC Webtoon</h2>
        <nav className="nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            홈
          </NavLink>
          <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : '')}>
            로그인
          </NavLink>
          <NavLink
            to="/premium/webtoon/1"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            프리미엄 웹툰
          </NavLink>
        </nav>
        <HeaderUser />
      </header>
      <div className="content">{children}</div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth/google/callback" element={<GoogleCallback />} />
            <Route
              path="/premium/webtoon/:id"
              element={
                <ProtectedRoute>
                  <PremiumWebtoon />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  )
}
