// src/components/ProtectedRoute.tsx
import { useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const [showModal, setShowModal] = useState(true);

  if (!isLoggedIn) {
    if (showModal) {
      return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#1b1c20] rounded-2xl p-8 w-[320px] text-center shadow-xl">
            <h2 className="text-white text-lg font-bold mb-3">
              로그인이 필요합니다
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              이 페이지는 로그인 후 이용할 수 있습니다.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="w-full py-2 rounded-lg bg-[#E50914] text-white font-semibold hover:bg-red-700 transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      );
    }

    // 확인 버튼 누르면 /login으로 이동, 원래 경로 state로 전달
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;