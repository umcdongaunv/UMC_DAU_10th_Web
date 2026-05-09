import axios from "../api/axiosInstance"
import { setTokens } from "../auth/token"

export default function Login() {
  const login = async () => {
    const res = await axios.post("/auth/login", {
      email: "test@test.com",
      password: "1234",
    })

    setTokens(res.data.accessToken, res.data.refreshToken)

    alert("로그인 성공")
  }

  return <button onClick={login}>로그인</button>
}