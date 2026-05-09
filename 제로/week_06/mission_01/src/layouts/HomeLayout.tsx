import { useState } from "react";
import { Outlet } from "react-router-dom";

import { Navbar } from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";

export const HomeLayout = () => {
  // 처음부터 열려있음
  const [isSidebarOpen, setIsSidebarOpen] =
    useState(true);

  return (
    <div className="h-dvh flex flex-col bg-black overflow-hidden">

      {/* Navbar */}
      <Navbar
        onToggleSidebar={() =>
          setIsSidebarOpen((prev) => !prev)
        }
      />

      {/* 중앙 영역 */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onCloseSidebar={() =>
            setIsSidebarOpen(false)
          }
        />

        {/* Main */}
        <main
          className="
            flex-1
            overflow-y-auto
            pt-16
          "
        >
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};