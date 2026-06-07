import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { Servicio } from '../../core/models/servicio.model';
import { MatrizService } from '../../core/services/matriz.service';
import { HighlightPipe } from '../../shared/pipes/highlight.pipe';

@Component({
  selector: 'app-buscador',
  standalone: true,
  imports: [ReactiveFormsModule, HighlightPipe],
  templateUrl: './buscador.component.html',
  styleUrl: './buscador.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuscadorComponent {
  private readonly matrizService = inject(MatrizService);

  readonly control = new FormControl('', { nonNullable: true });
  readonly termino = signal('');
  readonly resultados = this.matrizService.resultados;

  private readonly busqueda = this.control.valueChanges
    .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
    .subscribe((valor) => {
      this.termino.set(valor);
      this.matrizService.buscar(valor);
    });

  seleccionar(servicio: Servicio): void {
    this.matrizService.seleccionar(servicio);
    this.control.setValue('', { emitEvent: false });
    this.termino.set('');
    this.matrizService.buscar('');
  }
}
