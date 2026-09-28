import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { Location } from 'src/app/demo/api/location';
import { GooglePlaceAutocompleteDirective, PlaceSelection } from 'src/app/demo/directives/google-place-autocomplete.directive';

// Editable list of named locations (name + Google address). The first row is the main location.
@Component({
  selector: 'app-locations-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, TooltipModule, GooglePlaceAutocompleteDirective],
  template: `
    <div class="locations">
      <div *ngFor="let location of locations; let i = index; trackBy: trackByIndex" class="location-row">
        <input type="text" pInputText class="location-name" [(ngModel)]="location.name"
          [ngModelOptions]="{ standalone: true }" placeholder="Nome (ex.: localidade)" />
        <input type="text" pInputText class="location-address" autocomplete="off" [(ngModel)]="location.address"
          [ngModelOptions]="{ standalone: true }" placeholder="Morada" appGooglePlaceAutocomplete
          (placeSelected)="onPlaceSelected(location, $event)" />
        <span *ngIf="i === 0 && locations.length > 1" class="location-main" pTooltip="Localização principal" tooltipPosition="top">
          <i class="pi pi-star-fill"></i>
        </span>
        <button pButton type="button" icon="pi pi-trash" class="p-button-text p-button-danger p-button-sm"
          pTooltip="Remover" tooltipPosition="top" (click)="remove(i)"></button>
      </div>

      <button pButton type="button" icon="pi pi-plus" label="Adicionar localização"
        class="p-button-text p-button-sm add-location" (click)="add()"></button>
    </div>
  `,
  styles: [`
    .locations { display: flex; flex-direction: column; gap: 8px; }
    .location-row { display: flex; align-items: center; gap: 8px; }
    .location-name { flex: 0 0 38%; min-width: 0; }
    .location-address { flex: 1 1 auto; min-width: 0; }
    .location-main { color: var(--yellow-500); }
    .add-location { align-self: flex-start; }
  `]
})
export class LocationsEditorComponent {

  @Input() locations: Location[] = [];
  @Output() locationsChange = new EventEmitter<Location[]>();

  add(): void {
    this.locations = [...(this.locations ?? []), { name: '', address: '', placeId: '' }];
    this.locationsChange.emit(this.locations);
  }

  remove(index: number): void {
    this.locations = this.locations.filter((_, i) => i !== index);
    this.locationsChange.emit(this.locations);
  }

  onPlaceSelected(location: Location, place: PlaceSelection): void {
    location.address = place.address;
    location.placeId = place.placeId;
    this.locationsChange.emit(this.locations);
  }

  trackByIndex(index: number): number {
    return index;
  }
}
