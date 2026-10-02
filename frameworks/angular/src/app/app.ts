import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PorscheDesignSystemModule } from '@porsche-design-system/components-angular';
import { ColorSchemeSelectComponent } from '../components/common/color-scheme-select.component';
import { FormPageComponent } from './form.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PorscheDesignSystemModule, FormPageComponent, ColorSchemeSelectComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('angular');
}
