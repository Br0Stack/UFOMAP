import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TopoServiceService {

  constructor(private http:HttpClient) { }

  getSeries(seriesId) {
    
    const body = JSON.stringify(seriesId);
   
    return this.http.post('https://api.bls.gov/publicAPI/v2/timeseries/data/', body, httpOptions);
}
}
