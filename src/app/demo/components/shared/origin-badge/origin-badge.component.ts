import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';
import { ORIGIN_TYPES, OriginType } from 'src/app/demo/api/originType';

// Bola com duas letras do tipo da origem (Fu, Fo, Fi, Cr, Cl, EE), a pôr antes do nome; o nome do tipo aparece ao
// passar o rato. Sem tipo não mostra nada.
@Component({
  selector: 'app-origin-badge',
  standalone: true,
  imports: [CommonModule, TooltipModule],
  template: `
    <span *ngIf="info" [pTooltip]="info.label" tooltipPosition="top"
          class="inline-flex align-items-center justify-content-center border-circle surface-200 text-700 font-bold flex-shrink-0 mr-2 vertical-align-middle"
          style="width: 1.75rem; height: 1.75rem; font-size: 0.7rem">{{ info.short }}</span>
  `
})
export class OriginBadgeComponent {

  @Input() type: OriginType | null | undefined;

  get info() {
    return this.type ? ORIGIN_TYPES[this.type] : null;
  }
}
