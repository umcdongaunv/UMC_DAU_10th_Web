export default function Login() {
  const login = () => {
    window.location.href =
      "http://localhost:8000/v1/auth/google";
  };

  return (
    <div style={{ textAlign: "center", marginTop: 100 }}>
      <button onClick={login}>
        Google 로그인
      </button>
    </div>
  );
}