import { NavLink } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onCloseSidebar: () => void;
}

const Sidebar = ({
  isOpen,
  onCloseSidebar,
}: SidebarProps) => {
  return (
    <>
      {/* 오버레이 */}
      {isOpen && (
        <div
          className="
            fixed inset-0
            bg-black/50
            z-30
          "
          onClick={onCloseSidebar}
        />
      )}

      {/* 사이드바 */}
      <aside
        className={`
          fixed top-16 left-0
          h-[calc(100vh-4rem)]
          w-64
          bg-[#111111]
          text-white
          z-40
          transition-transform duration-300
          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        <nav className="flex flex-col h-full p-4">

          {/* 위 메뉴 */}
          <div className="flex flex-col gap-2">

            <NavLink
              to="/"
              onClick={onCloseSidebar}
              className={({ isActive }) =>
                `
                px-4 py-3 rounded-lg
                font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-[#E50914] text-white"
                    : "text-gray-300 hover:bg-[#222222] hover:text-white"
                }
                `
              }
            >
              홈
            </NavLink>

            <NavLink
              to="/search"
              onClick={onCloseSidebar}
              className={({ isActive }) =>
                `
                px-4 py-3 rounded-lg
                font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-[#E50914] text-white"
                    : "text-gray-300 hover:bg-[#222222] hover:text-white"
                }
                `
              }
            >
              내용 찾기
            </NavLink>

            <NavLink
              to="/my"
              onClick={onCloseSidebar}
              className={({ isActive }) =>
                `
                px-4 py-3 rounded-lg
                font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-[#E50914] text-white"
                    : "text-gray-300 hover:bg-[#222222] hover:text-white"
                }
                `
              }
            >
              마이페이지
            </NavLink>
          </div>

          {/* 아래 탈퇴 */}
          <NavLink
            to="/withdraw"
            onClick={onCloseSidebar}
            className={({ isActive }) =>
              `
              mt-auto
              px-4 py-3 rounded-lg
              font-medium transition-all duration-200
              ${
                isActive
                  ? "bg-red-600 text-white"
                  : "text-red-400 hover:bg-red-900/30 hover:text-red-300"
              }
              `
            }
          >
            탈퇴하기
          </NavLink>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;