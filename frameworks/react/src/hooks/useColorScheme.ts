import { useContext } from 'react';
import { ColorSchemeContext } from '../providers/ColorSchemeProvider.tsx';

export const useColorScheme = () => {
  const context = useContext(ColorSchemeContext);
  if (!context) {
    throw new Error('useColorScheme must be used within a ColorSchemeProvider');
  }
  return context;
};
