import { useState } from "react";
import { WriteModal } from "./WriteModal"; 

export const FloatingButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#E50914] text-white rounded-full 
                flex items-center justify-center shadow-lg hover:bg-red-700 
                hover:scale-110 active:scale-95 transition-all cursor-pointer z-40"
      >
        <span className="text-3xl leading-none font-bold mb-1">+</span>
      </button>

      {isModalOpen && (
        <WriteModal onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};