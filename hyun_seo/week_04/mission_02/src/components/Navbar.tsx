import { NavLink } from "react-router-dom"

const LINKS = [
  { to: '/', label: 'Home'},
  { to: '/login', label: 'Log In'},
  { to: '/Signup', label: 'Sign Up'},
];

export const Navbar = () => {
  return (
    <div className='flex gap-6 p-5 bg-black sticky top-0 z-50 shadow-lg'>
      {LINKS.map(({to, label}) => (
        <NavLink
          key={to}
          to={to}
          className={({isActive}) => 
            isActive 
              ? 'text-[#E50914] font-black text-lg transition-all duration-300' 
              : 'text-gray-400 font-medium hover:text-white transition-all duration-300'
          }
        >
          {label}
        </NavLink>
      ))}
    </div>
  );
};