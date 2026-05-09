import { useEffect } from "react";
import Login from "./Login";

export default function App() {
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    if (token) {
      localStorage.setItem("token", token);
      alert("로그인 성공!");
    }
  }, []);

  return <Login />;
}