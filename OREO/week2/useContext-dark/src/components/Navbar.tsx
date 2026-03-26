import { useTheme } from "../context/ThemeProvider";
import ThemeToggleButton from "./ThemeToggleButton";
import { clsx } from "clsx";

const Navbar = () => {
  const { theme } = useTheme();
  const isLightMode = theme === "light";

  return (
    <nav className={clsx(
      "w-full h-16 flex items-center justify-between px-8 border-b transition-colors duration-300",
      isLightMode ? "bg-white border-gray-200" : "bg-gray-900 border-gray-700"
    )}>
      <span className={clsx("font-bold", isLightMode ? "text-black" : "text-white")}>
        Navbar
      </span>
      <ThemeToggleButton />
    </nav>
  );
};

export default Navbar;