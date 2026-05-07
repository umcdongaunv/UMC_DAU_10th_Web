import { useNavigate } from "react-router-dom";

export const FloatingButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/my")}
      className="fixed bottom-24 right-8 w-14 h-14 bg-red-600 text-white rounded-full 
                flex items-center justify-center shadow-lg hover:bg-red-700 
                hover:scale-110 active:scale-95 transition-all cursor-pointer z-50"
    >
      <span className="text-3xl leading-none font-light mb-1">+</span>
    </button>
  );
};