import { Component, OnInit } from '@angular/core';
import * as L from '../../../node_modules/leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.less']
})
export class MapComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    var mymap = L.map('mapid').setView([42.505, -97], 5);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
      maxZoom: 18,
      attribution: 'Edwin Grier',
      id: 'mapbox.streets'
    }).addTo(mymap);
	}


  

}
