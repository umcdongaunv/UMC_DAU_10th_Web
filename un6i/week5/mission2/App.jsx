import { useState } from "react"
import { setTokens, clearTokens, getAccessToken } from "./auth/token"

export default function App() {
  const [email, setEmail] = useState("test")
  const [password, setPassword] = useState("1234")
  const [isLogin, setIsLogin] = useState(!!getAccessToken())

  // 🔥 mock login
  const login = () => {
    const fakeAccess = "access_" + Date.now()
    const fakeRefresh = "refresh_" + Date.now()

    setTokens(fakeAccess, fakeRefresh)
    setIsLogin(true)

    alert("로그인 성공 (mock)")
  }

  // logout
  const logout = () => {
    clearTokens()
    setIsLogin(false)
  }

  // 🔥 API 테스트 (mock 401 발생시키기)
  const testApi = () => {
    throw new Error("mock 401 error trigger")
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>🔥 Refresh Token Mock 미션</h1>

      {!isLogin ? (
        <div>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="아이디"
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            type="password"
          />

          <button onClick={login}>로그인</button>
        </div>
      ) : (
        <div>
          <h2>로그인 상태</h2>

          <button onClick={testApi}>API 테스트</button>
          <button onClick={logout}>로그아웃</button>
        </div>
      )}
    </div>
  )
}