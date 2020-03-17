import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

const endpoint = 'http://ufo-api.herokuapp.com/api/sightings/search?from=2000&to=2021&limit=999999';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const geoLocatorUrl = 'http://www.mapquestapi.com/geocoding/v1/address';



@Injectable({
  providedIn: 'root'
})
export class TopoServiceService {

  constructor(private http: HttpClient, public ngxLoader: NgxUiLoaderService) {
    (function() {
      ngxLoader.start();
      const cors_api_host = 'cors-anywhere.herokuapp.com';
      const cors_api_url = 'https://' + cors_api_host + '/';
      const slice = [].slice;
      const origin = window.location.protocol + '//' + window.location.host;
      const open = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function() {
        const args = slice.call(arguments);
        const targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);
          if (targetOrigin && targetOrigin[0].toLowerCase() !== origin &&
              targetOrigin[1] !== cors_api_host) {
              args[1] = cors_api_url + args[1];
          }
          return open.apply(this, args);
      };
  })();

   }

  private extractData(res: Response) {
    const body = res;
    return body || { };
  }
  getAliens(): Observable<any> {
    return this.http.get(endpoint).pipe(
      map(this.extractData));
  }
  getLocations(address) {
    console.log(address)
    const url = 'https://geocode.xyz/' + address + '?json=1';
    return this.http.get(url).pipe(
      map(this.extractData));
  }
}
