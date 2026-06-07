import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, signal } from '@angular/core';

const COPY_FEEDBACK_DURATION_MS = 2000;

@Component({
  selector: 'app-boton-copiar',
  standalone: true,
  imports: [],
  templateUrl: './boton-copiar.component.html',
  styleUrl: './boton-copiar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BotonCopiarComponent {
  private readonly destroyRef = inject(DestroyRef);
  private resetTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly cleanup = this.destroyRef.onDestroy(() => {
    if (this.resetTimer !== null) {
      clearTimeout(this.resetTimer);
    }
  });

  readonly texto = input.required<string>();
  readonly copiado = signal(false);

  async copiar(): Promise<void> {
    const clipboard = navigator.clipboard;

    if (!clipboard?.writeText) {
      return;
    }

    try {
      await clipboard.writeText(this.texto());
      this.mostrarConfirmacion();
    } catch {
      this.copiado.set(false);
    }
  }

  private mostrarConfirmacion(): void {
    this.copiado.set(true);

    if (this.resetTimer !== null) {
      clearTimeout(this.resetTimer);
    }

    this.resetTimer = setTimeout(() => {
      this.copiado.set(false);
      this.resetTimer = null;
    }, COPY_FEEDBACK_DURATION_MS);
  }
}
