import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PorscheDesignSystemModule, type SelectChangeEventDetail } from '@porsche-design-system/components-angular';
import type { Theme } from '../../models/theme';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'theme-select',
  standalone: true,
  imports: [PorscheDesignSystemModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-select name="theme" [value]="themeService.theme()" label="Theme" [compact]="true" class="w-48" (change)="onChange($event)">
      <p-select-option value="light">Light</p-select-option>
      <p-select-option value="dark">Dark</p-select-option>
      <p-select-option value="auto">Auto</p-select-option>
    </p-select>
  `,
})
export class ThemeSelectComponent {
  readonly themeService = inject(ThemeService);

  onChange(e: CustomEvent<SelectChangeEventDetail>): void {
    this.themeService.setTheme(e.detail.value as Theme);
  }
}
