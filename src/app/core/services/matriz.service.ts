import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, of } from 'rxjs';

import { Servicio } from '../models/servicio.model';

@Injectable({
  providedIn: 'root',
})
export class MatrizService {
  private readonly http = inject(HttpClient);
  private readonly _todos = signal<Servicio[]>([]);
  private readonly _termino = signal('');

  readonly seleccionado = signal<Servicio | null>(null);
  readonly resultados = computed(() => {
    const termino = this._termino().trim().toLowerCase();

    if (termino.length < 2) {
      return [];
    }

    return this._todos()
      .filter((servicio) => this.coincide(servicio, termino))
      .slice(0, 15);
  });

  private readonly cargaInicial = this.http
    .get<Servicio[]>('assets/data/matriz.json')
    .pipe(catchError(() => of([])))
    .subscribe((servicios) => {
      this._todos.set(servicios);
    });

  buscar(termino: string): void {
    this._termino.set(termino);
  }

  seleccionar(servicio: Servicio): void {
    this.seleccionado.set(servicio);
  }

  private coincide(servicio: Servicio, termino: string): boolean {
    return (
      servicio.nombre.toLowerCase().includes(termino) ||
      servicio.url.toLowerCase().includes(termino) ||
      servicio.categoria.toLowerCase().includes(termino)
    );
  }
}
