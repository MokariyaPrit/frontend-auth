import { useState, useMemo, createContext, useContext, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, PaletteMode, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme, ThemeContextProps } from '../theme/theme';

// Create theme context
const ThemeContext = createContext<ThemeContextProps>({
  mode: 'light',
  toggleMode: () => {},
});

// Hook to use theme context
export const useThemeContext = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // Get user's preferred color scheme
  const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Get saved theme from localStorage or use system preference
  const savedMode = localStorage.getItem('themeMode') as PaletteMode | null;
  const initialMode = savedMode || (prefersDarkMode ? 'dark' : 'light');
  
  const [mode, setMode] = useState<PaletteMode>(initialMode);

  // Toggle between light and dark mode
  const toggleMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  // Memoize theme context value
  const themeContextValue = useMemo(
    () => ({
      mode,
      toggleMode,
    }),
    [mode]
  );

  // Use the appropriate theme based on mode
  const theme = mode === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;