import type { Lp } from '../../types/lp';
import { useNavigate } from "react-router-dom";

interface LpCardProps {
  lp: Lp; // 단일 lp 객체
}

const LpCard = ({ lp }: LpCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/lp/${lp.id}`)}
      className="relative overflow-hidden rounded-2xl cursor-pointer group"
    >
      {/* 이미지 */}
      <img
        src={lp.thumbnail}
        alt={lp.title}
        className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-110"
      />

      {/* Overlay */}
      <div
        className="
          absolute inset-0
          bg-black/60
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300
          flex flex-col justify-end p-4
        "
      >
        <h2 className="text-lg font-bold">{lp.title}</h2>
        <p className="text-sm text-gray-300">
          업로드일: {new Date(lp.createdAt).toLocaleDateString()}
        </p>
        <p className="text-sm text-pink-400">
          ❤️ {lp.likes?.length ?? 0}
        </p>
      </div>
    </div>
  );
};

export default LpCard;