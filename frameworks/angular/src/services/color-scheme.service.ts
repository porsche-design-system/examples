import { Injectable, signal } from '@angular/core';
import type { ColorScheme } from '../models/colorScheme';

const COLOR_SCHEME_LOCAL_STORAGE_KEY = 'colorScheme';

@Injectable({
  providedIn: 'root',
})
export class ColorSchemeService {
  private readonly colorSchemeSignal = signal<ColorScheme>('scheme-light-dark');

  readonly colorScheme = this.colorSchemeSignal.asReadonly();

  constructor() {
    this.initColorScheme();
  }

  private initColorScheme(): void {
    const storedColorScheme = localStorage.getItem(COLOR_SCHEME_LOCAL_STORAGE_KEY) as ColorScheme | null;
    if (storedColorScheme) {
      this.setColorScheme(storedColorScheme);
    } else {
      this.applyColorSchemeToDOM(this.colorSchemeSignal());
    }
  }

  setColorScheme(colorScheme: ColorScheme): void {
    this.colorSchemeSignal.set(colorScheme);
    this.applyColorSchemeToDOM(colorScheme);
    localStorage.setItem(COLOR_SCHEME_LOCAL_STORAGE_KEY, colorScheme);
  }

  private applyColorSchemeToDOM(colorScheme: ColorScheme): void {
    document.documentElement.classList.remove('scheme-light', 'scheme-dark', 'scheme-light-dark');
    document.documentElement.classList.add(colorScheme);
  }
}
