import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  systemTheme: "light" | "dark";
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useTheme = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "system",
      systemTheme: "light",
      resolvedTheme: "light",
      
      setTheme: (theme: Theme) => {
        set({ theme });
        updateResolvedTheme();
      },
      
      toggleTheme: () => {
        const { resolvedTheme } = get();
        const newTheme = resolvedTheme === "light" ? "dark" : "light";
        set({ theme: newTheme });
        updateResolvedTheme();
      }
    }),
    {
      name: "safibuilds-theme-storage"
    }
  )
);

function updateResolvedTheme() {
  const { theme, systemTheme } = useTheme.getState();
  const resolved = theme === "system" ? systemTheme : theme;
  
  useTheme.setState({ resolvedTheme: resolved });
  
  // Apply theme to document
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(resolved);
  
  // Update meta theme-color
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute(
      "content", 
      resolved === "dark" ? "#1f2937" : "#6366f1"
    );
  }
}

function setupSystemThemeListener() {
  if (typeof window === "undefined") return;
  
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  
  const updateSystemTheme = (e: MediaQueryListEvent | MediaQueryList) => {
    useTheme.setState({ 
      systemTheme: e.matches ? "dark" : "light" 
    });
    updateResolvedTheme();
  };
  
  // Set initial system theme
  updateSystemTheme(mediaQuery);
  
  // Listen for changes
  mediaQuery.addEventListener("change", updateSystemTheme);
  
  return () => {
    mediaQuery.removeEventListener("change", updateSystemTheme);
  };
}

// Initialize on client side
if (typeof window !== "undefined") {
  setupSystemThemeListener();
  updateResolvedTheme();
}
