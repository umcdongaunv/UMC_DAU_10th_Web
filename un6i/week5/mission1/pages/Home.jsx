import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  // user 안전하게 가져오기
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // 프리미엄 결제
  const upgrade = () => {
    if (!user) {
      alert("로그인 먼저 해주세요!");
      navigate("/login");
      return;
    }

    const updatedUser = { ...user, isPremium: true };
    localStorage.setItem("user", JSON.stringify(updatedUser));

    alert("프리미엄 결제 완료!");
    window.location.reload();
  };

  // 로그아웃
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    alert("로그아웃 되었습니다!");
    window.location.reload();
  };

  return (
    <div className="container">
      <h1>🏠 홈 페이지</h1>

      {!user ? (
        <>
          <p style={{ marginTop: "10px", color: "#555" }}>
            로그인이 필요합니다
          </p>

          <button onClick={() => navigate("/login")}>
            로그인 하러가기
          </button>
        </>
      ) : (
        <>
          <p style={{ marginTop: "10px", color: "#555" }}>
            {user.name}님 환영합니다 👋
          </p>

          {!user.isPremium && (
            <button onClick={upgrade}>
              프리미엄 결제
            </button>
          )}

          <button onClick={logout}>
            로그아웃
          </button>
        </>
      )}
    </div>
  );
}