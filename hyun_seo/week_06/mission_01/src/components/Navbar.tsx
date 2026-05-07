import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import type { ResponseMyInfoDto } from "../types/auth";
import { getMyInfo } from "../apis/auth";

interface NavbarProps {
  onMenuClick?: () => void;
}

export const Navbar = ({ onMenuClick }: NavbarProps) => {
  const [data, setData] = useState<ResponseMyInfoDto | null>(null);
  const { accessToken, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getMyInfo();
        setData(response);
      } catch (error) {
        console.error(error);
        await logout();
        navigate("/login");
      }
    };

    if (accessToken) {
      getData();
    }
  }, [accessToken, navigate, logout]);

  const handleLogout = async () => {
    await logout();
    setData(null);
    navigate("/");
  };

  return (
    <nav className="bg-black shadow-md fixed w-full z-20 h-18 border-b border-gray-800">
      <div className="flex items-center justify-between p-4">
        
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="text-white cursor-pointer p-1 hover:bg-gray-900 rounded transition-colors"
            aria-label="Menu"
          >
            <svg 
              width="28" 
              height="28" 
              viewBox="0 0 48 48" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M7.95 11.95h32m-32 12h32m-32 12h32" 
                stroke="currentColor" 
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
          
          <Link to="/" className="text-xl font-bold text-[#E50914]">
            My Web
          </Link>
        </div>

        <div className="space-x-6 flex items-center">
          <Link to={"/search"} className="text-sm md:text-base font-semibold text-[#E50914] hover:text-red-700 transition-colors duration-200">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          {!accessToken ? (
            <>
              <Link to={"/login"} className="text-sm md:text-base font-semibold text-[#E50914] hover:text-red-700 transition-colors duration-200">
                Log In
              </Link>
              <Link to={"/signup"} className="text-sm md:text-base font-semibold text-[#E50914] hover:text-red-700 transition-colors duration-200">
                Sign up
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to={"/my"} className="text-sm md:text-base font-semibold text-white hover:text-gray-300 transition-colors duration-200">
                <span className="text-[#E50914] font-bold">
                  {data?.data?.name || "사용자"}
                </span>님 반갑습니다.
              </Link>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-[#E50914] text-white text-sm md:text-base font-bold rounded cursor-pointer hover:bg-red-700 transition-all duration-200 shadow-lg"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};