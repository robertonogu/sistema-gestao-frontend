/// <reference types="google.maps" />
import { Injectable } from '@angular/core';
import { PlaceSelection } from '../../directives/google-place-autocomplete.directive';
import { GoogleMapsLoaderService } from './googleMapsLoader.service';

// Resolves a free-text address (e.g. from nif.pt) into a Google place, so it gets a placeId like an autocomplete pick
@Injectable({ providedIn: 'root' })
export class GooglePlaceLookupService {

  constructor(private mapsLoader: GoogleMapsLoaderService) { }

  async findPlace(query: string): Promise<PlaceSelection | null> {
    await this.mapsLoader.load();
    const service = new google.maps.places.PlacesService(document.createElement('div'));

    return new Promise((resolve) => {
      service.findPlaceFromQuery({ query, fields: ['place_id', 'formatted_address'] }, (results, status) => {
        const place = results?.[0];
        if (status !== google.maps.places.PlacesServiceStatus.OK || !place?.place_id) {
          resolve(null);
          return;
        }
        resolve({ address: place.formatted_address ?? query, placeId: place.place_id });
      });
    });
  }
}
