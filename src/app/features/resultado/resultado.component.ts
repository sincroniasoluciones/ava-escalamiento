import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { MatrizService } from '../../core/services/matriz.service';
import { BotonCopiarComponent } from '../../shared/components/boton-copiar/boton-copiar.component';

@Component({
  selector: 'app-resultado',
  standalone: true,
  imports: [BotonCopiarComponent],
  templateUrl: './resultado.component.html',
  styleUrl: './resultado.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultadoComponent {
  private readonly matrizService = inject(MatrizService);

  readonly servicio = this.matrizService.seleccionado;
}
