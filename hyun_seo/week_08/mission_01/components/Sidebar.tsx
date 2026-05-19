import { useState } from "react"; // 1. useState 추가
import { Link, useLocation } from "react-router-dom";
import { WithdrawalModal } from "./WithdrawalModal"; // 2. 모달 임포트

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar = ({ onClose }: SidebarProps) => {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false); // 3. 모달 상태

  const mainMenuItems = [
    { label: "찾기", path: "/search", symbol: "🔍" },
    { label: "마이페이지", path: "/my", symbol: "👤" },
  ];

  const footerMenuItems = [
    { label: "설정", path: "/settings", symbol: "⚙️" },
  ];

  const renderLink = (item: { label: string; path: string; symbol: string }) => {
    const isActive = location.pathname === item.path;
    return (
      <Link
        key={item.path}
        to={item.path}
        onClick={onClose}
        className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
          isActive 
            ? "bg-neutral-800 text-white font-bold" 
            : "text-neutral-400 hover:text-white hover:bg-neutral-900"
        }`}
      >
        <span className="text-xl w-8 flex justify-center">{item.symbol}</span>
        <span className="text-base tracking-tight">{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      <aside className="w-64 h-full bg-black flex flex-col px-4 py-6 justify-between border-r border-neutral-900">
        <nav className="flex flex-col gap-2">
          {mainMenuItems.map(renderLink)}
        </nav>

        <nav className="flex flex-col gap-2 border-t border-neutral-800 pt-4">
          {footerMenuItems.map(renderLink)}
          
          {/* 4. 탈퇴하기 버튼 별도 구성 (Link 대신 button 사용) */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-4 px-4 py-3 rounded-xl text-neutral-400 hover:text-red-500 hover:bg-neutral-900 transition-all cursor-pointer"
          >
            <span className="text-xl w-8 flex justify-center">📤</span>
            <span className="text-base tracking-tight">탈퇴하기</span>
          </button>
        </nav>
      </aside>

      {/* 5. 모달 컴포넌트 배치 */}
      <WithdrawalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};