import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  const handleLogin = () => {
    // 👉 아주 간단한 테스트용 로그인
    if (id === "test" && pw === "1234") {
      const user = {
        name: id,
        isPremium: false,
      };

      localStorage.setItem("accessToken", "1234");
      localStorage.setItem("user", JSON.stringify(user));

      alert("로그인 성공!");
      navigate("/"); // 홈으로 이동
    } else {
      alert("아이디 또는 비밀번호가 틀렸습니다.");
    }
  };

  return (
    <div className="container">
      <h1>🔐 로그인</h1>

      <input
        type="text"
        placeholder="아이디 (test)"
        value={id}
        onChange={(e) => setId(e.target.value)}
        style={{ marginTop: "10px", padding: "8px", width: "100%" }}
      />

      <input
        type="password"
        placeholder="비밀번호 (1234)"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        style={{ marginTop: "10px", padding: "8px", width: "100%" }}
      />

      <button onClick={handleLogin}>
        로그인
      </button>
    </div>
  );
}