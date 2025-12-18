import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Theme } from '@/models/theme';

const THEME_LOCAL_STORAGE_KEY = 'theme';

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>('auto');

  function initTheme() {
    const storedTheme = localStorage.getItem(THEME_LOCAL_STORAGE_KEY) as Theme | null;
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      applyThemeToDOM(theme.value);
    }
  }

  function setTheme(newTheme: Theme) {
    theme.value = newTheme;
    applyThemeToDOM(newTheme);
    localStorage.setItem(THEME_LOCAL_STORAGE_KEY, newTheme);
  }

  function applyThemeToDOM(themeValue: Theme) {
    document.documentElement.classList.remove('light', 'dark', 'auto');
    document.documentElement.classList.add(themeValue);
  }

  return { theme, initTheme, setTheme };
});
