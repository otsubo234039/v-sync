import { useTheme } from "@/context/ThemeContext";
import { COLOR_PRESETS } from "@/models/Theme";

export const useStaffSettings = () => {
  const { accentColor, setAccentColor, themeMode, setThemeMode, backgroundStyle, baseTextColor } = useTheme();

  // HEXコード入力時のハンドラ
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccentColor(`#${e.target.value}`);
  };

  return {
    accentColor,
    setAccentColor,
    themeMode,
    setThemeMode,
    backgroundStyle,
    baseTextColor,
    COLOR_PRESETS,
    handleHexChange
  };
};