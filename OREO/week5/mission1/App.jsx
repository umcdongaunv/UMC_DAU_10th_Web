import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import PremiumWebtoon from './pages/PremiumWebtoon.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import './App.css'

function NotFound() {
  return (
    <main className="page">
      <h1>404</h1>
      <p>요청하신 페이지를 찾을 수 없어요.</p>
      <Link to="/">홈으로 돌아가기</Link>
    </main>
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
      </header>
      <div className="content">{children}</div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
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
    </BrowserRouter>
  )
}
