import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { BuscadorComponent } from './features/buscador/buscador.component';
import { HistorialComponent } from './features/historial/historial.component';
import { ResultadoComponent } from './features/resultado/resultado.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BuscadorComponent, ResultadoComponent, HistorialComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  protected readonly appName = signal('AVA — Asistente de Escalamiento');
}
