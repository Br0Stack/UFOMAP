import { Component, OnInit, AfterViewInit } from '@angular/core';
//import * as L from '../../../node_modules/leaflet';
import { TopoServiceService } from '../topo-service.service';
import * as $ from 'jquery';
import 'leaflet-sidebar-v2';
import {VectorMarkers} from 'Leaflet.vector-markers';
import 'Leaflet.vector-markers'
declare var require: any

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.less']
})
export class MapComponent implements OnInit {
  mymap: any;
  constructor(public sy?: TopoServiceService) {
   }

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

// const sidebar = L.control.sidebar({ container: 'sidebar', position: 'left' })
// .addTo(this.mymap)
// .open('home');
//sidebar.open('home');
  }

  ngAfterViewInit(){
   //var require: any
    const jsonURL = require('../../assets/csvjson.json');
    console.log(jsonURL)
    for (let a = 0; a < jsonURL.length; a++) {
      var city = jsonURL[a].city;
      var comments = jsonURL[a].comments;
      var country = jsonURL[a].country;
      var date = jsonURL[a].datetime;
      var duration = jsonURL[a].duration
      var lat = jsonURL[a].latitude
      var lng = jsonURL[a].longitude
      var shape = jsonURL[a].shape
      var state = jsonURL[a].state

      //var datetimeEnd = "12/23/2004 07:15"

      var endTime = new Date('01/12/2000 12:00:00 AM').toUTCString();
      //var endTime = new Date('02/12/2013 12:00:00 AM');
      var redMarker = L.VectorMarkers.icon({
        icon: 'coffee',
        markerColor: 'red'
      });
     
      L.marker([lat,lng], {icon: redMarker}).addTo(this.mymap);
      if( date < endTime){

       // L.marker([lat,lng], {icon: L.VectorMarkers.icon({icon: 'rocket', prefix: 'fa', markerColor: '#002b36', iconColor: '#eee8d5'}) }).addTo(this.mymap);
      // let myMarker = L.marker([lat, lng], {
      //   title:  city +" | "+ date + " | " + shape, 
      //   // icon: L.icon({
      //   //   iconSize: [25, 25],
      //   //   iconAnchor: [10, 16],
      //   //   popupAnchor: [2, 10],
      //   //   iconUrl: 'assets/img/equipment.png'
      //     //iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAdCAMAAABhTZc9AAABrVBMVEUAAAD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADk0M8AAAAAAADZxsQAAAAAAAAAAAAAAAAAAAAAAAAAAACrnJoAAACnmJcAAACklZQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABvZWQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABaUlLXp6QAAADOoJ0AAAAAAABOSEcAAAAAAABMRkXVnJewiIUAAADon5rmnpkAAAAAAABBOzpAOjrPjYgAAAAAAAAAAAA7NjUAAACmeXaLbGm7f3udc281MDB+YmCQamcxLSzedm4wLCugbWnadG3UcWmYaGRnUE+MX1xmT03AZ1/cX1V0VVOEWle1YVrUWlHPWE/cUkitXVarW1XTTkXFVEvRTkPDU0qlWFK7UEe4TkbBSD7OQDbNQDbARz7VOCzUNyvQNivRNSrQNSrPNSnVKx7///810hSwAAAAjXRSTlMAAAECAwQFBgcICQoLDA0ODxAREhMUFRYXGRobHB0eICEiIyMkJSUmJygpKi4vLzAwMTEyMzY3Ojs9PkFDRUdISUpLTE9RVVdZWl1eX2RmaGlpbG5vcXJ3enx+gIKFh4iKioyOk5eZn6OkpqanrK67vb6+wcXJysrP0NLW2Nrb3N7l6e3t7u/x8vf3+Po5t2BCAAABpElEQVQoz31S0WoUQRCs7p7Z3buwikG4IFFMEFF8CYiIIPrl+uAH+OjBEQwqimiS9XJhb3d2ptuHrLdrPOyXKaboquqeIcJ/aiC5P/VvlgAC08HR3ew2TsPn9ycwADCAAAZLfvjyYNNx/Oajwq5YJleUz5/5kWB49zYaFBAmf2Pv1VMBqC9ADosTGBmEfLn34gkAkA057+GTmUFkMntwxEPAfor9b+dGxjzdfeT+GNrG2r/2BLCbzmZbpsf9hwxwNr2zfU+PBWA/2R1ubMTuC7ETzgdJsh4b4B3gmCfD2jCCt4SMiUaBbJyNAQaawZJG7ksQGAjbMwcArFpdH/UK/lSAk55u7z1OAMdudb4xs8H363cFODbhhwFE1D8hiAhIH2oFRNxOpjf/0Z0vlm0yEdnxbOU1cjGv1kFNhJGJduX45+piUV22MUGEmcVS7fMNeTb/slq2ISqcabzMUwp1UZYuR61VdXZRL0NSM3XQrq3a2BTFL0ewGJumXq2bLiYDnGoMSHE19TkTTNuu7tZd10U1gFjEOS8iLmOCaYgppZhS1AT9DUFhvPrXKeTuAAAAAElFTkSuQmCC'
      //   // })
      // }).addTo(this.mymap)
             
     }
    }
  }
  showPanel() {
    // setTimeout(function () {
    //   // var x = document.getElementById("slide-panels")
    //   // x.style.display = "block"
    //     $(".slide-panels").show();
    //     $(document).ready(function () {
    //         $(".collapse.in").each(function () {
    //             $(this).siblings(".panel-heading").find(".glyphicon").addClass("glyphicon-minus").removeClass("glyphicon-plus");
    //         });
    //         $(".collapse").on('show.bs.collapse', function () {
    //             $(this).parent().find(".glyphicon").removeClass("glyphicon-plus").addClass("glyphicon-minus");
    //         }).on('hide.bs.collapse', function () {
    //             $(this).parent().find(".glyphicon").removeClass("glyphicon-minus").addClass("glyphicon-plus");
    //         });
    //     });


    // }, 200);
}
  getSeries() {
    const seriesBody = {
      seriesid: ['OEUN000000000000015113001'],
      startyear: '2018',
      endyear: '2018',
      catalog: true,
      calculations: false,
      //annualaverage: true,
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
