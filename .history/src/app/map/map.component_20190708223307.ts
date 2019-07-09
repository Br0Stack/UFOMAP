import { Component, OnInit } from '@angular/core';
import * as L from '../../../node_modules/leaflet';
import { TopoServiceService } from '../topo-service.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.less']
})
export class MapComponent implements OnInit {
  mymap: any;

  constructor(public sy?: TopoServiceService) { }

  ngOnInit() {
    this.mymap = L.map('mapid').setView([42.505, -97], 4);

    // tslint:disable-next-line:max-line-length
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
      maxZoom: 18,
      attribution: 'Edwin Grier',
      id: 'mapbox.streets'
    }).addTo(this.mymap);
let that = this
    that.mymap.locate({setView: true, maxZoom: 4});

    this.mymap.on('locationfound', onLocationFound);
  function onLocationFound(e) {
    var radius = e.accuracy;

    L.marker(e.latlng).addTo(that.mymap)
    .bindPopup('You are here').openPopup();
       // .bindPopup("You are within " + radius + " meters from this job").openPopup();

    L.circle(e.latlng, radius).addTo(that.mymap);
}
this.mymap.on('locationerror', onLocationError);

function onLocationError(e) {
  alert(e.message);
}
this.getSeries();

  }
  getSeries() {
    const seriesBody = {
      series_id: ['OEUN000000000000015113001'],
      // startyear: '2017',
      // endyear: '2019',
      // catalog: true,
      // calculations: true,
      // annualaverage: true,
      registrationkey: '324ee24d5dac410485461df0d4f492db'
    };
       this.sy.getSeries(seriesBody).subscribe(
        data => {
          console.log(data);
        //  this.books = data[0]
        //  this.movies = data[1]
         });
  }
}
