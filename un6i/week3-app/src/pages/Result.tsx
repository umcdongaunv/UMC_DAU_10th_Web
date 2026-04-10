import { useState } from 'react';
import { Wheel } from 'react-custom-roulette';
import { useNavigate } from 'react-router-dom';

const data = [
  { option: "버터떡" },
  { option: "두쫀쿠" },
  { option: "떡볶이" },
  { option: "짜장면" },
  { option: "닭강정" },
  { option: "만두" },
  { option: "밀면" },
  { option: "계란" },
  { option: "치밥" },
  { option: "닭칼국수" },
  { option: "삼겹살" },
  { option: "갈비찜" },
];

function Result() {
  const navigate = useNavigate();

  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [selectedFood, setSelectedFood] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [finalChoice, setFinalChoice] = useState("");

  const handleSpinClick = () => {
    if (mustSpin) return;

    const newPrize = Math.floor(Math.random() * data.length);
    setPrizeNumber(newPrize);
    setMustSpin(true);
    setShowResult(false);
    setFinalChoice("");
  };

  const handleStop = () => {
    setMustSpin(false);
    const food = data[prizeNumber].option;
    setSelectedFood(food);
    setShowResult(true);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">

      {/* 🎡 룰렛 화면 */}
      {!showResult && (
        <>
          <h1 className="text-3xl font-bold mb-6">🎰 음식 룰렛</h1>

          <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={prizeNumber}
            data={data}
            onStopSpinning={handleStop}
            outerBorderWidth={3}
            outerBorderColor="#000"
            radiusLineWidth={1}
            radiusLineColor="#fff"
            textColors={["#fff"]}
            backgroundColors={[
              "#ef4444",
              "#f97316",
              "#eab308",
              "#22c55e",
              "#3b82f6",
              "#6366f1",
              "#a855f7",
            ]}
          />

          <button
            onClick={handleSpinClick}
            className="mt-6 px-6 py-3 bg-black text-white rounded-xl"
          >
            돌리기 🎯
          </button>
        </>
      )}

      {/* 🎉 결과 화면 */}
      {showResult && !finalChoice && (
        <>
          <h1 className="text-3xl font-bold mb-6">
            🎉 {selectedFood} 당첨!!
          </h1>

          <div className="flex gap-4">
            <button
              onClick={() => setFinalChoice("good")}
              className="px-6 py-3 bg-green-500 text-white rounded-xl"
            >
              👍 좋다
            </button>

            <button
              onClick={() => {
                setShowResult(false);
                setMustSpin(false);
              }}
              className="px-6 py-3 bg-red-500 text-white rounded-xl"
            >
              👎 싫다
            </button>
          </div>
        </>
      )}

      {/* 🎯 최종 선택 */}
      {finalChoice === "good" && (
        <>
          <h1 className="text-3xl font-bold mb-6">
            😎 오늘은 {selectedFood} 확정!
          </h1>

          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg"
          >
            처음으로 🏠
          </button>
        </>
      )}

    </div>
  );
}

export default Result;