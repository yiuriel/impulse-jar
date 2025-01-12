import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type ThemeMode = "light" | "dark";
type ColorScheme = "green" | "blue" | "purple" | "orange" | "pink" | "red" | "teal" | "indigo";

interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
}

const themeColorSchemes: Record<ColorScheme, ThemeColors> = {
  green: {
    primary: "#2E7D32",
    secondary: "#4CAF50",
    background: "#F5F5F5",
    card: "#FFFFFF",
    text: "#212121",
    textSecondary: "#757575",
    border: "#E0E0E0",
  },
  blue: {
    primary: "#1976D2",
    secondary: "#2196F3",
    background: "#F5F5F5",
    card: "#FFFFFF",
    text: "#212121",
    textSecondary: "#757575",
    border: "#E0E0E0",
  },
  purple: {
    primary: "#7B1FA2",
    secondary: "#9C27B0",
    background: "#F5F5F5",
    card: "#FFFFFF",
    text: "#212121",
    textSecondary: "#757575",
    border: "#E0E0E0",
  },
  orange: {
    primary: "#F57C00",
    secondary: "#FF9800",
    background: "#F5F5F5",
    card: "#FFFFFF",
    text: "#212121",
    textSecondary: "#757575",
    border: "#E0E0E0",
  },
  pink: {
    primary: "#C2185B",
    secondary: "#E91E63",
    background: "#F5F5F5",
    card: "#FFFFFF",
    text: "#212121",
    textSecondary: "#757575",
    border: "#E0E0E0",
  },
  red: {
    primary: "#D32F2F",
    secondary: "#F44336",
    background: "#F5F5F5",
    card: "#FFFFFF",
    text: "#212121",
    textSecondary: "#757575",
    border: "#E0E0E0",
  },
  teal: {
    primary: "#00796B",
    secondary: "#009688",
    background: "#F5F5F5",
    card: "#FFFFFF",
    text: "#212121",
    textSecondary: "#757575",
    border: "#E0E0E0",
  },
  indigo: {
    primary: "#303F9F",
    secondary: "#3F51B5",
    background: "#F5F5F5",
    card: "#FFFFFF",
    text: "#212121",
    textSecondary: "#757575",
    border: "#E0E0E0",
  },
};

const darkThemeOverrides: Partial<ThemeColors> = {
  background: "#121212",
  card: "#1E1E1E",
  text: "#FFFFFF",
  textSecondary: "#B0B0B0",
  border: "#2C2C2C",
};

interface ThemeContextType {
  mode: ThemeMode;
  colorScheme: ColorScheme;
  colors: ThemeColors;
  toggleTheme: () => void;
  setColorScheme: (scheme: ColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_MODE_KEY = "@theme_mode";
const COLOR_SCHEME_KEY = "@color_scheme";

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<ThemeMode>("light");
  const [colorScheme, setColorScheme] = useState<ColorScheme>("green");

  useEffect(() => {
    loadThemePreferences();
  }, []);

  const loadThemePreferences = async () => {
    try {
      const [savedMode, savedScheme] = await Promise.all([
        AsyncStorage.getItem(THEME_MODE_KEY),
        AsyncStorage.getItem(COLOR_SCHEME_KEY),
      ]);

      if (savedMode) setMode(savedMode as ThemeMode);
      if (savedScheme) setColorScheme(savedScheme as ColorScheme);
    } catch (error) {
      console.error("Failed to load theme preferences:", error);
    }
  };

  const toggleTheme = async () => {
    const newMode = mode === "light" ? "dark" : "light";
    try {
      await AsyncStorage.setItem(THEME_MODE_KEY, newMode);
      setMode(newMode);
    } catch (error) {
      console.error("Failed to save theme mode:", error);
    }
  };

  const handleSetColorScheme = async (scheme: ColorScheme) => {
    try {
      await AsyncStorage.setItem(COLOR_SCHEME_KEY, scheme);
      setColorScheme(scheme);
    } catch (error) {
      console.error("Failed to save color scheme:", error);
    }
  };

  const baseColors = themeColorSchemes[colorScheme];
  const colors =
    mode === "dark" ? { ...baseColors, ...darkThemeOverrides } : baseColors;

  const value = {
    mode,
    colorScheme,
    colors,
    toggleTheme,
    setColorScheme: handleSetColorScheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
