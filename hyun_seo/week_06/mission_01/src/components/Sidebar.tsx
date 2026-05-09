import { Link } from "react-router-dom";

export const Sidebar = () => {
  const menuItems = [
    { label: "찾기", path: "/search", symbol: "🔍" },
    { label: "마이페이지", path: "/my", symbol: "👤" },
  ];

  return (
    <aside className="w-64 h-full bg-black border-r border-gray-800 flex flex-col p-4">
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center gap-3 text-gray-400 hover:text-white hover:bg-gray-900 p-3 rounded-lg transition-all"
          >
            <span className="text-xl">{item.symbol}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};