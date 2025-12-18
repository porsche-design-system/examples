import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PorscheDesignSystemModule } from '@porsche-design-system/components-angular';
import { ThemeSelectComponent } from '../components/common/theme-select.component';
import { FormPageComponent } from './form.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PorscheDesignSystemModule, FormPageComponent, ThemeSelectComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('angular');
}
