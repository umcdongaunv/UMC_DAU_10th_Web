import { NavLink } from "react-router-dom";

const LINKS = [
  { to: '/login', label: '로그인'},
  { to: '/Signup', label: '회원가입'},
];

export const Navbar = () => {
  return (
    <div className="flex justify-end gap-4 p-5 bg-black sticky top-0 z-50 shadow-lg">
      {LINKS.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `
            px-4 py-2 rounded-md text-sm font-semibold transition-all duration-300
            ${isActive 
              ? 'bg-[#E50914] text-white' 
              : 'bg-[#1a1a1a] text-gray-300 hover:bg-[#333] hover:text-white'}
            `
          }
        >
          {label}
        </NavLink>
      ))}
    </div>
  );
};