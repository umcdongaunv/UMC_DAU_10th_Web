import { useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Navbar } from "../components/Navbar";
import Footer from "../components/Footer";

const ProtectedLayout = () => {
  const { accessToken } = useAuth();
  const location = useLocation();
  const [showModal, setShowModal] = useState(true);

  if (!accessToken) {
    if (showModal) {
      return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#1b1c20] rounded-2xl p-8 w-[320px] text-center shadow-xl">
            <h2 className="text-white text-lg font-bold mb-3">
              로그인이 필요한 서비스입니다.
            </h2>
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

    // 확인 버튼 클릭 후 → /login으로 이동, 원래 경로 저장
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="h-dvh flex flex-col bg-black overflow-hidden">
      <Navbar />
      <main className="flex-1 overflow-y-auto mt-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default ProtectedLayout;