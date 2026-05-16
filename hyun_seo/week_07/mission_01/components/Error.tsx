export const Error = ({ message, onBack }: { message: string; onBack: () => void }) => (
  <div className="w-full h-screen flex flex-col items-center justify-center bg-black text-white px-4 text-center">
    <p className="mb-4 text-base">{message}</p>
    <button 
      onClick={onBack} 
      className="px-4 py-2 bg-red-600 hover:bg-red-700 transition-colors rounded-md text-sm font-medium"
    >
      뒤로 가기 🔙
    </button>
  </div>
);