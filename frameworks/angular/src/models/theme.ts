export const THEME_TYPES = ['light', 'dark', 'auto'] as const;
export type Theme = (typeof THEME_TYPES)[number];
