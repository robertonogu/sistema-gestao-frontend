// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { HttpHeaders } from "@angular/common/http";
import { secrets } from "./secrets";

export const environment = {
  production: false,
  // Mesmo endereço por onde a página foi aberta: localhost no PC, ou o IP do PC na rede (ex.: 192.168.1.79)
  // quando a página é aberta pelo telemóvel para testar a leitura de faturas
  apiUrl: `http://${window.location.hostname}:8080`,
  googleMapsApiKey: secrets.googleMapsApiKey,

  httpOptions: {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
