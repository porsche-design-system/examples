const COLOR_SCHEMES = ['scheme-light', 'scheme-dark', 'scheme-light-dark'] as const;
export type ColorScheme = (typeof COLOR_SCHEMES)[number];

const COLOR_SCHEME_LOCAL_STORAGE_KEY = 'color-scheme';

export function getStoredColorScheme(): ColorScheme {
  return (localStorage.getItem(COLOR_SCHEME_LOCAL_STORAGE_KEY) as ColorScheme) || 'scheme-light-dark';
}

export function applyColorScheme(colorScheme: ColorScheme): void {
  document.documentElement.classList.remove('scheme-light', 'scheme-dark', 'scheme-light-dark');
  document.documentElement.classList.add(colorScheme);
  localStorage.setItem(COLOR_SCHEME_LOCAL_STORAGE_KEY, colorScheme);
}

export function initColorScheme(): ColorScheme {
  const colorScheme = getStoredColorScheme();
  applyColorScheme(colorScheme);
  return colorScheme;
}

export function setupColorSchemeSelect(selector: string): void {
  const colorSchemeSelect = document.querySelector<HTMLElement & { value: ColorScheme }>(selector);
  if (!colorSchemeSelect) return;

  colorSchemeSelect.value = getStoredColorScheme();

  colorSchemeSelect.addEventListener('change', (e) => {
    const colorScheme = (e.target as HTMLElement & { value: ColorScheme }).value;
    applyColorScheme(colorScheme);
  });
}
