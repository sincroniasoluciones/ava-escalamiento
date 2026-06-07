import { effect, inject, Injectable, Signal, signal, untracked } from '@angular/core';

import { Servicio } from '../models/servicio.model';
import { MatrizService } from './matriz.service';

export interface HistorialItem {
  timestamp: string;
  servicio: Servicio;
}

@Injectable({
  providedIn: 'root',
})
export class HistorialService {
  private readonly matrizService = inject(MatrizService);
  private readonly STORAGE_KEY = 'ava_historial';
  private readonly _historial = signal<HistorialItem[]>(this.cargarDesdeStorage());
  private readonly registroAutomatico = effect(() => {
    const servicio = this.matrizService.seleccionado();

    if (servicio === null) {
      return;
    }

    untracked(() => {
      this.guardar(servicio);
    });
  });

  readonly historial = this._historial.asReadonly();

  guardar(servicio: Servicio): void {
    const actual = this._historial();
    const ultimo = actual[0];

    if (ultimo?.servicio.id === servicio.id) {
      return;
    }

    const item: HistorialItem = {
      timestamp: new Date().toISOString(),
      servicio,
    };
    const actualizado = [item, ...actual];

    this._historial.set(actualizado);
    this.persistir(actualizado);
  }

  obtener(): Signal<HistorialItem[]> {
    return this.historial;
  }

  limpiar(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } finally {
      this._historial.set([]);
    }
  }

  private cargarDesdeStorage(): HistorialItem[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);

      if (data === null) {
        return [];
      }

      const parsed: unknown = JSON.parse(data) as unknown;

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.filter((item): item is HistorialItem => this.esHistorialItem(item));
    } catch {
      return [];
    }
  }

  private persistir(historial: HistorialItem[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(historial));
    } catch {
      return;
    }
  }

  private esHistorialItem(value: unknown): value is HistorialItem {
    if (!this.esRegistro(value)) {
      return false;
    }

    return typeof value['timestamp'] === 'string' && this.esServicio(value['servicio']);
  }

  private esServicio(value: unknown): value is Servicio {
    if (!this.esRegistro(value)) {
      return false;
    }

    return (
      typeof value['id'] === 'number' &&
      typeof value['nombre'] === 'string' &&
      typeof value['url'] === 'string' &&
      typeof value['categoria'] === 'string' &&
      this.esCriticidad(value['criticidad']) &&
      this.esListaTexto(value['tecnologias']) &&
      this.esListaTexto(value['descartes']) &&
      typeof value['equipo_escalamiento'] === 'string' &&
      typeof value['responsable'] === 'string' &&
      typeof value['descripcion_cierre'] === 'string' &&
      typeof value['guia_escalamiento'] === 'string'
    );
  }

  private esCriticidad(value: unknown): value is Servicio['criticidad'] {
    return value === 'Alta' || value === 'Media' || value === 'Baja';
  }

  private esListaTexto(value: unknown): value is string[] {
    return Array.isArray(value) && value.every((item) => typeof item === 'string');
  }

  private esRegistro(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }
}
