/// <reference types="google.maps" />
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

declare global {
  interface Window {
    google?: typeof google;
    __googleMapsCallback?: () => void;
  }
}

@Injectable({ providedIn: 'root' })
export class GoogleMapsLoaderService {

  private loadPromise: Promise<void> | null = null;

  load(): Promise<void> {
    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = new Promise((resolve, reject) => {
      if (window.google?.maps?.places) {
        resolve();
        return;
      }

      if (!environment.googleMapsApiKey) {
        reject(new Error('Chave da API do Google Maps não configurada (environment.googleMapsApiKey).'));
        return;
      }

      window.__googleMapsCallback = () => resolve();

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=places&loading=async&callback=__googleMapsCallback`;
      script.async = true;
      script.defer = true;
      script.onerror = () => reject(new Error('Não foi possível carregar a API do Google Maps.'));

      document.head.appendChild(script);
    });

    return this.loadPromise;
  }
}
