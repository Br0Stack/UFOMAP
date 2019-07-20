import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from '../../../node_modules/leaflet';
import { TopoServiceService } from '../topo-service.service';
import * as $ from 'jquery';
import 'leaflet-sidebar-v2';
import 'leaflet.markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet/dist/images/marker-icon-2x.png';
import 'leaflet/dist/images/marker-shadow.png';
declare var require: any

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.less']
})
export class MapComponent implements OnInit {
  mymap: any;
  clusterGroup: any;

  constructor(public sy?: TopoServiceService) {
   }

  ngOnInit() {
    this.mymap = L.map('mapid', {  zoomControl: false, renderer: L.canvas()}).setView([42.505, -97], 4);

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Edwin Grier'
}).addTo(this.mymap);
//add zoom control with your options
L.control.zoom({
  position:'bottomleft'
}).addTo(this.mymap);
var CartoDB_VoyagerOnlyLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png', {
	attribution: 'www.EdwinGrier.com; Dataset by: Kaggle',
	subdomains: 'abcd',
	maxZoom: 19
}).addTo(this.mymap);
//     L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
// 	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
// 	subdomains: 'abcd',
//   maxZoom: 14,
//   minZoom: 4
// }).addTo(this.mymap);
// L.tileLayer('http://www.justicemap.org/tile/{size}/income/{z}/{x}/{y}.png', {
// 	attribution: '<a href="http://www.justicemap.org/terms.php">Justice Map</a>',
// 	size: 'county',
// 	bounds: [[14, -180], [72, -56]]
// }).addTo(this.mymap);
    // L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    //   maxZoom: 18,
    //   attribution: 'Edwin Grier',
    //   preferCanvas: true,
    //   id: 'mapbox.streets'
    // }).addTo(this.mymap);

//     that.mymap.locate({setView: true, maxZoom: 4});

//     this.mymap.on('locationfound', onLocationFound);
//   function onLocationFound(e) {
//     var radius = e.accuracy;

//     L.marker(e.latlng).addTo(that.mymap)
//     .bindPopup('You are here').openPopup();
//        // .bindPopup("You are within " + radius + " meters from this job").openPopup();

//     L.circle(e.latlng, radius).addTo(that.mymap);
// }
// this.mymap.on('locationerror', onLocationError);

// function onLocationError(e) {
//   alert(e.message);
// }
this.clusterGroup = new L.markerClusterGroup({
  maxClusterRadius: 50,
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: true,
  zoomToBoundsOnClick: true
});
this.clusterGroup.on('clustermouseover', function (e) {
  e.layer.bindTooltip(e.layer.getAllChildMarkers().length + ' UFO sightings in this area (click)');
  e.layer.openTooltip();
});
var marker = new L.marker([56, -106], { opacity: 0.01 }); //opacity may be set to zero
marker.bindTooltip('Map of UFO Sightings In the U.S. 1940-2015', {permanent: true, className: 'my-label', offset: [-200, 80] });
marker.addTo(this.mymap);
// var legend = L.control({position: 'topleft'});
// legend.addTo(this.mymap) //TO DO
//this.getSeries();
  }

  ngAfterViewInit(){
    const sidebar = L.control.sidebar({
      autopan: true,       // whether to maintain the centered map point when opening the sidebar
      closeButton: true,    // whether t add a close button to the panes
      container: 'sidebar', // the DOM container or #ID of a predefined sidebar container that should be used
      position: 'left',     // left or right
  }).addTo(this.mymap);
    const jsonURL = require('../../assets/csvjson.json');
    console.log(jsonURL)
    const endTime = new Date('01/12/2010 12:00:00 AM').toUTCString();
    for (let a = 0; a < jsonURL.length; a++) {
      const city = jsonURL[a].city;
      const comments = jsonURL[a].comments;
      const country = jsonURL[a].country;
      const date = jsonURL[a].datetime;
      // var duration = jsonURL[a].duration
      const lat = jsonURL[a].latitude
      const lng = jsonURL[a].longitude
      const shape = jsonURL[a].shape
      //var state = jsonURL[a].state
      //var datetimeEnd = "12/23/2004 07:15"
      //var endTime = new Date('02/12/2013 12:00:00 AM');

      if(shape === 'fireball') {
      const iconImage = 'assets/img/ufo.png';
      }
      else if(shape === 'chevron') {
        const iconImage = 'assets/img/chevron.png';
        }
        else if(shape === 'oval') {
          const iconImage = 'assets/img/oval.png';
          }
          else if(shape === 'formation') {
            const iconImage = 'assets/img/formation.png';
            }
            else if(shape === 'sphere') {
              const iconImage = 'assets/img/sphere.png';
              }
              else if(shape === 'light') {
                const iconImage = 'assets/img/light.png';
                }
                else if(shape === 'rectangle') {
                  const iconImage = 'assets/img/rectangle.png';
                  }
                  else if(shape === 'disk') {
                    const iconImage = 'assets/img/disk.png';
                    }
                    else if(shape === 'changing') {
                      const iconImage = 'assets/img/changing.png';
                      }
                      else if(shape === 'cigar') {
                        const iconImage = 'assets/img/cigar.png';
                        }
                        else if(shape === 'circle') {
                          const iconImage = 'assets/img/circle.png';
                          } else if(shape === 'triangle') {
                            const iconImage = 'assets/img/triangle.png';
                            }
                          else
                          {
                          var iconImage = 'assets/img/sphere.png';
                          }
      const icon = L.icon({
        iconUrl: iconImage,
        iconSize: [30, 30],
        iconAnchor: [10, 9]
      });
      //var markers = [];

      if( country === 'us' ) {
        const marker = L.marker([lat,lng], {icon: icon});
        this.clusterGroup.addLayer(marker);
        marker.bindPopup('Date: ' + date + ' ' + comments + ' | ' + 'shape:  ' + shape + ' | ' + city);
        marker.on('mouseover', function (e) {
          this.openPopup();
      });
      marker.on('mouseout', function (e) {
          this.closePopup();
      });
     }

  }
    this.clusterGroup.addTo(this.mymap);
  

  // getSeries() {
  //   const seriesBody = {
  //     seriesid: ['OEUN000000000000015113001'],
  //     startyear: '2018',
  //     endyear: '2018',
  //     catalog: true,
  //     calculations: false,
  //     //annualaverage: true,
  //     registrationkey: '324ee24d5dac410485461df0d4f492db'
  //   };
  //      this.sy.getSeries(seriesBody).subscribe(
  //       data => {
  //         console.log(data);
  //       //  this.books = data[0]
  //       //  this.movies = data[1]
  //        });
  // }

}}
