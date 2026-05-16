import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import useLogout from "../hooks/mutations/useLogout";

const LINKS = [
  { to: "/signup", label: "회원가입" },
];

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar = ({onToggleSidebar}: NavbarProps) => {
  const {isLoggedIn, user, clearAuth,} = useAuth();

  const navigate = useNavigate();

  const {mutate: logoutMutate,isPending,} = useLogout(() => {

    clearAuth();

    navigate("/login", {
      replace: true,
    });
  });

  return (
    <header
      className="
        flex justify-between items-center
        px-4 py-2
        bg-black
        sticky top-0
        z-50
        shadow-lg
      "
    >
      {/* 왼쪽 영역 */}
      <div className="flex items-center">

        {/* 햄버거 버튼 */}
        <button
          onClick={onToggleSidebar}
          className="
            mr-4
            text-white
            hover:opacity-80
            transition-opacity
          "
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4"
              d="M7.95 11.95h32m-32 12h32m-32 12h32"
            />
          </svg>
        </button>

        {/* 로고 */}
        <NavLink
          to="/"
          className="
            text-white
            text-xl
            font-bold
            hover:text-[#E50914]
            transition-colors
          "
        >
          DOLIGO
        </NavLink>
      </div>

      {/* 오른쪽 메뉴 */}
      <div className="flex gap-4 items-center">
        {isLoggedIn ? (
          <>
            <span className="text-white font-medium">
              {user?.name}님 반갑습니다.
            </span>

            <button
              onClick={() => logoutMutate()}
              disabled={isPending}
              className="
                px-4 py-2 rounded-md
                text-sm font-semibold
                bg-[#1a1a1a]
                text-gray-300
                hover:bg-[#333]
                hover:text-white
                transition-all duration-300
              "
            >
              {isPending
                ? "로그아웃 중..."
                : "로그아웃"}
            </button>
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `
                px-4 py-2 rounded-md
                text-sm font-semibold
                transition-all duration-300
                ${
                  isActive
                    ? "bg-[#E50914] text-white"
                    : "bg-[#1a1a1a] text-gray-300 hover:bg-[#333] hover:text-white"
                }
                `
              }
            >
              로그인
            </NavLink>

            {LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `
                  px-4 py-2 rounded-md
                  text-sm font-semibold
                  transition-all duration-300
                  ${
                    isActive
                      ? "bg-[#E50914] text-white"
                      : "bg-[#1a1a1a] text-gray-300 hover:bg-[#333] hover:text-white"
                  }
                  `
                }
              >
                {label}
              </NavLink>
            ))}
          </>
        )}
      </div>
    </header>
  );
};