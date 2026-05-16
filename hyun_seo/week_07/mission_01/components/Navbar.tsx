import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useGetMyInfo from "../hooks/queries/useGetMyInfo"; 
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLogout } from "../apis/auth";
import { LOCAL_STORAGE_KEY } from "../constants/key";

interface NavbarProps {
  onMenuClick?: () => void; 
}

export const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: me } = useGetMyInfo(accessToken);

  const {mutate: logoutMutation} = useMutation({
    mutationFn: postLogout,
    onSuccess: () => {
      localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
      queryClient.clear();

      alert("로그아웃 되었습니다.");

      navigate("/", {replace: true});
      window.location.reload();
    },
    onError: (error) => {
      console.error("로그아웃 실패: ", error);
      localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
      window.location.href = "/";
    },
  });

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")){
      logoutMutation();
    }
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
          <Link to={"/search"} className="text-[#E50914] hover:text-red-700 transition-colors">
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
              <Link to={"/login"} className="text-sm md:text-base font-semibold text-[#E50914]">Log In</Link>
              <Link to={"/signup"} className="text-sm md:text-base font-semibold text-[#E50914]">Sign up</Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to={"/my"} className="text-sm md:text-base font-semibold text-white">
                <span className="text-[#E50914] font-bold">
                  {me?.data?.name || "사용자"}
                </span>님 반갑습니다.
              </Link>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-[#E50914] text-white text-sm md:text-base font-bold rounded cursor-pointer hover:bg-red-700 transition-all shadow-lg"
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