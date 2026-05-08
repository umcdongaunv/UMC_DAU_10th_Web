import { useState, useEffect } from "react"; // 1. useEffect 추가
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { Footer } from "../components/Footer";
import { FloatingButton } from "../components/FloatingButton";

export const HomeLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); 

  return (
    <div className="min-h-screen flex flex-col bg-black relative">
      <div className="z-50 shrink-0">
        <Navbar onMenuClick={toggleSidebar} />
      </div>
      
      <div className="flex flex-1 relative"> 
        {isSidebarOpen && (
          <div 
            className="absolute inset-0 bg-black/40 z-30 cursor-pointer" 
            onClick={toggleSidebar}
          />
        )}

        <div className={`
          absolute top-0 left-0 h-full w-64 bg-black border-r border-gray-800 z-40
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
          <Sidebar />
        </div>

        <main className={`
          flex-1 w-full relative bg-[#0a0a0a] transition-all duration-300
          flex flex-col
          ${isSidebarOpen ? "blur-sm brightness-50 pointer-events-none" : "blur-none"}
        `}>
            <Outlet />    
        </main>
      </div>
      
      <div className={`fixed bottom-10 right-10 z-50`}>
        <FloatingButton />
      </div>
      
      <div className="z-10 shrink-0">
        <Footer />
      </div>
    </div>
  );
};