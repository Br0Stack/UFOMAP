import { Component, OnInit } from '@angular/core';
import * as L from '../../../node_modules/leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.less']
})
export class MapComponent implements OnInit {
  mymap: any;

  constructor() { }

  ngOnInit() {
    this.findUserLocation()
    this.mymap = L.map('mapid').setView([42.505, -97], 4);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
      maxZoom: 18,
      attribution: 'Edwin Grier',
      id: 'mapbox.streets'
    }).addTo(this.mymap);


    this.mymap.on('locationfound', onLocationFound);
  function onLocationFound(e) {
    var radius = e.accuracy;

    L.marker(e.latlng).addTo(this.mymap)
        .bindPopup("You are within " + radius + " meters from this job").openPopup();

    L.circle(e.latlng, radius).addTo(this.mymap);
}
this.mymap.on('locationerror', onLocationError);

function onLocationError(e) {
  alert(e.message);
}
	}

findUserLocation(){


}
}