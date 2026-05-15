import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ requirePremium }) => {
  const token = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user"));

  // 로그인 안 했으면
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 프리미엄 필요한데 아닌 경우
  if (requirePremium && !user?.isPremium) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;