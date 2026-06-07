import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { HistorialService } from '../../core/services/historial.service';

const HORA_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
};

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistorialComponent {
  private readonly historialService = inject(HistorialService);

  readonly historial = this.historialService.historial;

  limpiar(): void {
    const confirmado = confirm('¿Deseas eliminar el historial del turno?');

    if (confirmado) {
      this.historialService.limpiar();
    }
  }

  formatearHora(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString(undefined, HORA_FORMAT_OPTIONS);
  }
}
