import { useTheme } from "../context/ThemeProvider";
import { clsx } from "clsx";

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();
  const isLightMode = theme === "light";

  return (
    <button
      onClick={toggleTheme}
      className={clsx(
        "px-4 py-2 rounded-lg font-medium transition-all duration-300",
        isLightMode ? "bg-black text-white" : "bg-white text-black"
      )}
    >
      {isLightMode ? "다크 모드로" : "라이트 모드로"}
    </button>
  );
};

export default ThemeToggleButton;