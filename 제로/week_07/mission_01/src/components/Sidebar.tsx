import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import { useState }
from "react";

import useWithdraw
from "../hooks/mutations/useWithdraw";

import { useAuth }
from "../context/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onCloseSidebar: () => void;
}

const Sidebar = ({
  isOpen,
  onCloseSidebar,
}: SidebarProps) => {
  const navigate = useNavigate();

  const { clearAuth } = useAuth();

  const [isModalOpen, setIsModalOpen]
  = useState(false);

  const {
    mutate: withdrawMutate,
    isPending,
  } = useWithdraw(async () => {

    setIsModalOpen(false);

    clearAuth();

    navigate("/login", {
      replace: true,
    });
  });
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
          <button
            onClick={() =>
              setIsModalOpen(true)
            }
            className="
              mt-auto
              px-4 py-3 rounded-lg
              font-medium transition-all duration-200
              text-red-400
              hover:bg-red-900/30
              hover:text-red-300
              text-left
            "
          >
            탈퇴하기
          </button>
        </nav>
      </aside>
      {isModalOpen && (
  <div
    className="
      fixed inset-0
      bg-black/60
      flex items-center
      justify-center
      z-50
    "
  >
    <div
      className="
        bg-[#181818]
        p-6
        rounded-2xl
        w-[320px]
        text-white
      "
    >
      <h2
        className="
          text-lg font-bold mb-4
        "
      >
        정말 탈퇴하시겠습니까?
      </h2>

      <p
        className="
          text-sm text-gray-400 mb-6
        "
      >
        탈퇴 후 계정은 복구할 수 없습니다.
      </p>

      <div className="flex gap-3">

        <button
          onClick={() =>
            setIsModalOpen(false)
          }
          className="
            flex-1 py-2
            rounded-lg
            bg-gray-700
          "
        >
          아니오
        </button>

        <button
         onClick={() => {

          setIsModalOpen(false);

          withdrawMutate();
        }}
          disabled={isPending}
          className="
            flex-1 py-2
            rounded-lg
            bg-red-600
            hover:bg-red-700
          "
        >
          {isPending
            ? "탈퇴 중..."
            : "예"}
        </button>

      </div>
    </div>
  </div>
)}
    </>
    
  );
  
};

export default Sidebar;