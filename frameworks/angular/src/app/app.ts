import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PorscheDesignSystemModule } from '@porsche-design-system/components-angular';
import {FormPageComponent} from './form.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PorscheDesignSystemModule, FormPageComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('angular');
}
