import { useNavigate } from 'react-router-dom';

const NavBar = () => {

   const navigate = useNavigate();


  return (
      <div
      className="h-[60px] bg-black/80 text-white flex items-center justify-between px-4">
         <div
         className="text-lg font-bold text-pink-500" >
            돌려돌려LP판
         </div>
         <div>
            <button 
            onClick={() => navigate('/login')}
            className="ml-2 bg-black hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition">
               로그인
            </button>
            <button 
            onClick={() => navigate('/signup')}
            className="ml-2 bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-md transition">
               회원가입
            </button>
         </div>
      </div>
  )
}

export default NavBar;