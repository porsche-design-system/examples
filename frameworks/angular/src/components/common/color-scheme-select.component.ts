import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PorscheDesignSystemModule, type SelectChangeEventDetail } from '@porsche-design-system/components-angular';
import type { ColorScheme } from '../../models/colorScheme';
import { ColorSchemeService } from '../../services/color-scheme.service';

@Component({
  selector: 'color-scheme-select',
  standalone: true,
  imports: [PorscheDesignSystemModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-select name="color-scheme" [value]="colorSchemeService.colorScheme()" label="Color Scheme" [compact]="true"
              class="w-48"
              (change)="onChange($event)">
      <p-select-option value="scheme-light">Light</p-select-option>
      <p-select-option value="scheme-dark">Dark</p-select-option>
      <p-select-option value="scheme-light-dark">Light Dark</p-select-option>
    </p-select>
  `,
})
export class ColorSchemeSelectComponent {
  readonly colorSchemeService = inject(ColorSchemeService);

  onChange(e: CustomEvent<SelectChangeEventDetail>): void {
    this.colorSchemeService.setColorScheme(e.detail.value as ColorScheme);
  }
}
