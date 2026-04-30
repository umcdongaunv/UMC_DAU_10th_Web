import { useNavigate } from 'react-router-dom';

export const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-full bg-black text-white gap-4">
      <h1 className="text-6xl font-bold text-red-600">404</h1>
      <p className="text-xl text-gray-400">페이지를 찾을 수 없습니다.</p>
      <button
        onClick={() => navigate('/')}
        className="mt-4 px-6 py-3 bg-red-700 hover:bg-red-600 rounded-md font-bold transition-all cursor-pointer"
      >
        홈으로
      </button>
    </div>
  );
};
