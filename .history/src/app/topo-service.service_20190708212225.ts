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
    seriesId = { 
      series_id: "OEUN000000011100011000001"
    }
    return this.http.get('https://api.bls.gov/publicAPI/v2/timeseries/data/');
}
}
