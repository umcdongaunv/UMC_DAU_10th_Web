import { useTheme } from "../context/ThemeProvider";
import { clsx } from "clsx";

const ThemeContent = () => {
  const { theme } = useTheme();
  const isLightMode = theme === "light";

  return (
    <div className={clsx(
      "flex-1 w-full flex flex-col items-center justify-center transition-colors duration-300",
      isLightMode ? "bg-white text-black" : "bg-gray-800 text-white"
    )}>
      <h1 className="text-4xl font-bold mb-4">Theme Content</h1>
      <p className="text-lg text-center">현재 {theme.toUpperCase()} 모드 상태입니다.</p>
    </div>
  );
};

export default ThemeContent;