import { createContext, type PropsWithChildren, useEffect, useState } from 'react';
import type { ColorScheme } from '../models/colorScheme.ts';

interface ColorSchemeContextProps {
  colorScheme: ColorScheme;
  setColorScheme: (colorScheme: ColorScheme) => void;
}

const colorSchemeLocalStorageKey = 'color-scheme';

export const ColorSchemeContext = createContext<ColorSchemeContextProps | undefined>(undefined);

export const ColorSchemeProvider = ({ children }: PropsWithChildren) => {
  const [selectedColorScheme, setSelectedColorScheme] = useState<ColorScheme>('scheme-light-dark');

  // Load initial state from localStorage once component mounts
  useEffect(() => {
    const storedColorScheme = localStorage.getItem(colorSchemeLocalStorageKey) as ColorScheme | null;
    if (storedColorScheme) {
      setColorScheme(storedColorScheme);
    }
  }, []);

  const setColorScheme = (colorScheme: ColorScheme) => {
    setSelectedColorScheme(colorScheme);
    document.documentElement.classList.remove('scheme-light', 'scheme-dark', 'scheme-light-dark');
    document.documentElement.classList.add(colorScheme);
    localStorage.setItem(colorSchemeLocalStorageKey, colorScheme);
  };

  return (
    <ColorSchemeContext.Provider value={{ colorScheme: selectedColorScheme, setColorScheme }}>
      {children}
    </ColorSchemeContext.Provider>
  );
};
