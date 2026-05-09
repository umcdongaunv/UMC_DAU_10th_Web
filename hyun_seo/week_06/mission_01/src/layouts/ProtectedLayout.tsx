import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export const ProtectedLayout = () => {
  const { accessToken } = useAuth();
  const location = useLocation();
  
  if (!accessToken) {
    alert("로그인이 필요한 서비스입니다.");
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return (
    <div className="h-screen flex flex-col bg-black overflow-hidden relative">
      <div className="z-50 shrink-0">
        <Navbar />
      </div>

      <div className="flex flex-1 min-h-0 relative">
        <main className="flex-1 w-full relative bg-[#0a0a0a] flex flex-col min-h-0">
          <div className="flex-1 w-full overflow-y-auto overflow-x-hidden flex flex-col">
            <div className="flex-1">
              <Outlet />
            </div>
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
};