import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ColorScheme } from '@/models/colorScheme.ts';

const COLOR_SCHEME_LOCAL_STORAGE_KEY = 'color-scheme';

export const useColorSchemeStore = defineStore('colorScheme', () => {
  const colorScheme = ref<ColorScheme>('scheme-light-dark');

  function initColorScheme() {
    const storedColorScheme = localStorage.getItem(COLOR_SCHEME_LOCAL_STORAGE_KEY) as ColorScheme | null;
    if (storedColorScheme) {
      setColorScheme(storedColorScheme);
    } else {
      applyColorSchemeToDOM(colorScheme.value);
    }
  }

  function setColorScheme(newColorScheme: ColorScheme) {
    colorScheme.value = newColorScheme;
    applyColorSchemeToDOM(newColorScheme);
    localStorage.setItem(COLOR_SCHEME_LOCAL_STORAGE_KEY, newColorScheme);
  }

  function applyColorSchemeToDOM(colorSchemeValue: ColorScheme) {
    document.documentElement.classList.remove('scheme-light', 'scheme-dark', 'scheme-light-dark');
    document.documentElement.classList.add(colorSchemeValue);
  }

  return { colorScheme, initColorScheme, setColorScheme };
});
