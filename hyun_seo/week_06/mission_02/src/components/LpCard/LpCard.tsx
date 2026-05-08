import type { Lp } from '../../types/lp'

interface LpCardProps {
  lp: Lp
  onClick?: () => void 
}

export const LpCard = ({lp, onClick}:LpCardProps) => {
  return (
    <div onClick={onClick} className="hover:-translate-y-1 hover:scale-105 relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
      <img src={lp.thumbnail} alt={lp.title} className="object-cover w-full h-48" />
      <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-75 p-2">
        <h3 className="text-black text-sm font-semibold">{lp.title}</h3>
      </div>
    </div>
  )
}
