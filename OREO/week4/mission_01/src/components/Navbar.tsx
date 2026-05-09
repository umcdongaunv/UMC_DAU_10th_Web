import { NavLink } from "react-router-dom";

const LINKS = [
  { to: "/", label: "홈" },
  { to: "/movies/popular", label: "인기 영화" },
  { to: "/movies/now_playing", label: "상영 중" },
  { to: "/movies/top_rated", label: "높은 평점" },
  { to: "/movies/upcoming", label: "개봉 예정" },
];

export const Navbar = () => {
  return (
    <nav className="flex gap-3 p-4 border-b border-gray-200">
      {LINKS.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            isActive ? "text-[#b2dab1] font-bold" : "text-gray-500 hover:text-gray-800 transition-colors"
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
};
