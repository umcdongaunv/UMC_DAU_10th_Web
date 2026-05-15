import clsx from "clsx";
import { THEME, useTheme } from "./context/ThemeProvider";

export const ThemeContent = () => {
  const { theme } = useTheme();

  const isLightMode = theme === THEME.LIGHT;

  return (
    <div
      className={clsx(
        "p-4 flex-1 w-full flex flex-col items-center justify-center transition-colors duration-300",
        isLightMode ? "bg-white" : "bg-gray-800"
      )}
    >
      <h1
        className={clsx(
          "text-4xl font-bold",
          isLightMode ? "text-black" : "text-white"
        )}
      >
        Theme Content
      </h1>
      <p className={clsx("mt-2", isLightMode ? "text-black" : "text-white")}>
        The current theme is {theme}.
      </p>
    </div>
  );
};