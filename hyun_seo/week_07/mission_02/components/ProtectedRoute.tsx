import { useLocation, Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = () => {
  const { accessToken } = useAuth();
  const location = useLocation();

  if (!accessToken) {
    alert("로그인이 필요합니다.");
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
};