import { Injectable, signal } from '@angular/core';
import type { Theme } from '../models/theme';

const THEME_LOCAL_STORAGE_KEY = 'theme';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly themeSignal = signal<Theme>('auto');

  readonly theme = this.themeSignal.asReadonly();

  constructor() {
    this.initTheme();
  }

  private initTheme(): void {
    const storedTheme = localStorage.getItem(THEME_LOCAL_STORAGE_KEY) as Theme | null;
    if (storedTheme) {
      this.setTheme(storedTheme);
    } else {
      this.applyThemeToDOM(this.themeSignal());
    }
  }

  setTheme(theme: Theme): void {
    this.themeSignal.set(theme);
    this.applyThemeToDOM(theme);
    localStorage.setItem(THEME_LOCAL_STORAGE_KEY, theme);
  }

  private applyThemeToDOM(theme: Theme): void {
    document.documentElement.classList.remove('light', 'dark', 'auto');
    document.documentElement.classList.add(theme);
  }
}
