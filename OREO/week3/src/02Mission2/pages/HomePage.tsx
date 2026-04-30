import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";

// Navbar는 고정, Outlet에 자식 라우트 렌더링
const HomePage = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default HomePage;
