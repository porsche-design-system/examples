const THEME_TYPES = ['light', 'dark', 'auto'] as const;
export type Theme = (typeof THEME_TYPES)[number];

const THEME_LOCAL_STORAGE_KEY = 'theme';

export function getStoredTheme(): Theme {
  return (localStorage.getItem(THEME_LOCAL_STORAGE_KEY) as Theme) || 'auto';
}

export function applyTheme(theme: Theme): void {
  document.documentElement.classList.remove('light', 'dark', 'auto');
  document.documentElement.classList.add(theme);
  localStorage.setItem(THEME_LOCAL_STORAGE_KEY, theme);
}

export function initTheme(): Theme {
  const theme = getStoredTheme();
  applyTheme(theme);
  return theme;
}

export function setupThemeSelect(selector: string): void {
  const themeSelect = document.querySelector<HTMLElement & { value: Theme }>(selector);
  if (!themeSelect) return;

  themeSelect.value = getStoredTheme();

  themeSelect.addEventListener('change', (e) => {
    const theme = (e.target as HTMLElement & { value: Theme }).value;
    applyTheme(theme);
  });
}
