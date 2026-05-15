import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-6">🍽️ 음식 추천 룰렛</h1>

      <button
        onClick={() => navigate('/result')}
        className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
      >
        룰렛 돌리기 ~~🎰
      </button>
    </div>
  );
}

export default Home;