/// <reference types="google.maps" />
import { Directive, ElementRef, EventEmitter, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { GoogleMapsLoaderService } from '../service/common/googleMapsLoader.service';

export interface PlaceSelection {
  address: string;
  placeId: string;
}

@Directive({
  selector: '[appGooglePlaceAutocomplete]',
  standalone: true,
})
export class GooglePlaceAutocompleteDirective implements OnInit, OnDestroy {

  @Output() placeSelected = new EventEmitter<PlaceSelection>();

  private autocomplete?: google.maps.places.Autocomplete;
  private listener?: google.maps.MapsEventListener;

  constructor(
    private el: ElementRef<HTMLInputElement>,
    private zone: NgZone,
    private mapsLoader: GoogleMapsLoaderService,
  ) { }

  ngOnInit(): void {
    this.mapsLoader.load().then(() => {
      this.autocomplete = new google.maps.places.Autocomplete(this.el.nativeElement, {
        fields: ['place_id', 'formatted_address', 'name'],
      });

      this.listener = this.autocomplete.addListener('place_changed', () => {
        const place = this.autocomplete!.getPlace();
        if (!place.place_id) {
          return;
        }
        this.zone.run(() => {
          this.placeSelected.emit({
            address: place.formatted_address ?? place.name ?? this.el.nativeElement.value,
            placeId: place.place_id!,
          });
        });
      });
    }).catch((err) => console.error(err));
  }

  ngOnDestroy(): void {
    if (this.listener) {
      google.maps.event.removeListener(this.listener);
    }
  }
}
