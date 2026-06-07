import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highlight',
  standalone: true,
  pure: true,
})
export class HighlightPipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);

  transform(text: string | null | undefined, term: string | null | undefined): SafeHtml {
    const value = text ?? '';
    const searchTerm = term?.trim() ?? '';

    if (!searchTerm) {
      return this.sanitizer.bypassSecurityTrustHtml(this.escapeHtml(value));
    }

    const pattern = new RegExp(this.escapeRegExp(searchTerm), 'gi');
    const highlighted = this.highlightMatches(value, pattern);

    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }

  private highlightMatches(value: string, pattern: RegExp): string {
    let highlighted = '';
    let lastIndex = 0;

    for (const match of value.matchAll(pattern)) {
      const matchIndex = match.index ?? 0;
      const matchText = match[0];

      highlighted += this.escapeHtml(value.slice(lastIndex, matchIndex));
      highlighted += `<mark class="highlight">${this.escapeHtml(matchText)}</mark>`;
      lastIndex = matchIndex + matchText.length;
    }

    return highlighted + this.escapeHtml(value.slice(lastIndex));
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
