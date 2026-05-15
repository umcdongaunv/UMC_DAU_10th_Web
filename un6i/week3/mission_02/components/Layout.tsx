import { Outlet, NavLink } from "react-router-dom";

export default function Layout() {
  return (
    <div>
      <nav style={{ display: "flex", gap: "20px", padding: "10px" }}>
        <NavLink to="/" end style={({ isActive }) => ({
          color: isActive ? "red" : "black"
        })}>홈</NavLink>

        <NavLink to="/popular" style={({ isActive }) => ({
          color: isActive ? "red" : "black"
        })}>인기 영화</NavLink>

        <NavLink to="/upcoming" style={({ isActive }) => ({
          color: isActive ? "red" : "black"
        })}>개봉 예정</NavLink>

        <NavLink to="/toprated" style={({ isActive }) => ({
          color: isActive ? "red" : "black"
        })}>평점 높은</NavLink>

        <NavLink to="/nowplaying" style={({ isActive }) => ({
          color: isActive ? "red" : "black"
        })}>상영 중</NavLink>
      </nav>

      <main style={{ padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
}