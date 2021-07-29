import {
  Component,
  OnInit,
  AfterViewInit
} from '@angular/core';
import * as L from '../../../node_modules/leaflet';
import {
  TopoServiceService
} from '../topo-service.service';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import 'leaflet-sidebar-v2';
import 'leaflet.markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet/dist/images/marker-icon-2x.png';
import 'leaflet/dist/images/marker-shadow.png';
import MiniMap from 'leaflet-minimap';
// @ts-ignore
import * as data from '../../assets/dataset/nuforc_reports.json';
//import 'd3';
declare let require: any;
// declare let window: any;
// declare let xmlNode: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.less']
})
export class MapComponent implements OnInit {
  mymap: any;
  clusterGroup: any;
  xmlNode: any;
  newestAliens: any;
  markers: any = [];

  constructor(public sy: TopoServiceService, public ngxLoader: NgxUiLoaderService) {}

  ngOnInit() {
    this.mymap = L.map('mapid', {
      zoomControl: false,
      renderer: L.canvas()
    }).setView([42.505, -97], 4);

    const tile = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Edwin Grier'
    });
    tile.addTo(this.mymap);
    const miniTile = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Edwin Grier'
    });
    const magniTile = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Edwin Grier'
    });
    //add zoom control with your options
    L.control.zoom({
      position: 'bottomleft'
    }).addTo(this.mymap);
    let CartoDB_VoyagerOnlyLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png', {
      attribution: 'www.EdwinGrier.com',
      subdomains: 'abcd',
      maxZoom: 18
    }).addTo(this.mymap);

    this.clusterGroup = new L.markerClusterGroup({
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: true,
      zoomToBoundsOnClick: true,
      //iconCreateFunction: defineClusterIcon
    });
    this.clusterGroup.on('clustermouseover', function (e) {
      e.layer.bindTooltip(e.layer.getAllChildMarkers().length + ' UFO sightings in this area (click)');
      e.layer.openTooltip();
    });
    const marker = new L.marker([56, -106], {
      opacity: 0.01
    }); //opacity may be set to zero
    // marker.bindTooltip('Map of UFO Sightings Across the World', {
    //   permanent: true,
    //   className: 'my-label',
    //   offset: [-200, 80]
    // });
    // marker.addTo(this.mymap);
    const options = {
      position: 'bottomright',
      zoomAnimation: true,
      toggleDisplay: true,

    };
    new MiniMap(miniTile, options).addTo(this.mymap);
  //   const control = new L.Control.Bookmarks({
  //     name: 'ufos-bookmarks', // defaults to 'leaflet-bookmarks'
  //     localStorage: true // if you want to use local variable for storage
  // });

  //   const magnifyingGlass = L.magnifyingGlass({
  //     layers: [ magniTile, ...this.markers ]
  // });
  // this.mymap.addLayer(magnifyingGlass);
  }

  ngAfterViewInit() {
    const sidebar = L.control.sidebar({
      autopan: true, // whether to maintain the centered map point when opening the sidebar
      closeButton: true, // whether t add a close button to the panes
      container: 'sidebar', // the DOM container or #ID of a predefined sidebar container that should be used
      position: 'left', // left or right
    }).addTo(this.mymap);

    this.makeInitialApiCall();
  }

  makeInitialApiCall() {
      const alienSightings = data.data; 
      this.populateMap(alienSightings, 'api');
    // const jsonURL = require('../../assets/csvjson.json');
    // this.populateMap(jsonURL, 'json');
  }

  populateMap(alienSightings, type) {
    console.log(alienSightings);
    alienSightings.forEach(element => {
      let city, state, summary, duration, date, lat, lng, shape, comments, country, url = '';
      if (type === 'api') {
        city = element.city;
        state = element.state;
        summary = element.summary;
        duration = element.duration;
        date = element.date_time;
        url = element.report_link;
        if (element.city_latitude && element.city_longitude) {
          lat = element.city_latitude;
          lng = element.city_longitude;
        }
        shape = element.shape;
      } else {
        city = element.city;
        comments = element.comments;
        country = element.country;
        date = element.datetime;
        lat = element.latitude;
        lng = element.longitude;
        shape = element.shape;
      }
      let iconImage;
      switch (shape) {
        case 'Fireball':
          iconImage = 'assets/img/ufo.png';
          break;
        case 'fireball':
          iconImage = 'assets/img/ufo.png';
          break;
        case 'chevron':
          iconImage = 'assets/img/chevron.png';
          break;
        case 'Chevron':
          iconImage = 'assets/img/chevron.png';
          break;
        case 'oval':
          iconImage = 'assets/img/oval.png';
          break;
        case 'Oval':
          iconImage = 'assets/img/oval.png';
          break;
        case 'formation':
          iconImage = 'assets/img/formation.png';
          break;
        case 'Formation':
          iconImage = 'assets/img/formation.png';
          break;
        case 'sphere':
          iconImage = 'assets/img/sphere.png';
          break;
        case 'Sphere':
          iconImage = 'assets/img/sphere.png';
          break;
        case 'light':
          iconImage = 'assets/img/light.png';
          break;
        case 'Light':
          iconImage = 'assets/img/light.png';
          break;
        case 'rectangle':
          iconImage = 'assets/img/rectangle.png';
          break;
        case 'Rectangle':
          iconImage = 'assets/img/rectangle.png';
          break;
        case 'disk':
          iconImage = 'assets/img/disk.png';
          break;
        case 'Disk':
          iconImage = 'assets/img/disk.png';
          break;
        case 'changing':
          iconImage = 'assets/img/changing.png';
          break;
        case 'Changing':
          iconImage = 'assets/img/changing.png';
          break;
        case 'cigar':
          iconImage = 'assets/img/cigar.png';
          break;
        case 'Cigar':
          iconImage = 'assets/img/cigar.png';
          break;
        case 'circle':
          iconImage = 'assets/img/circle.png';
          break;
        case 'Circle':
          iconImage = 'assets/img/circle.png';
          break;
        case 'triangle':
          iconImage = 'assets/img/triangle.png';
          break;
        case 'Triangle':
          iconImage = 'assets/img/triangle.png';
          break;
        case 'cigar':
          iconImage = 'assets/img/cigar.png';
          break;
        case 'Cigar':
          iconImage = 'assets/img/cigar.png';
          break;
        default:
          iconImage = 'assets/img/other.png';
      }
      const icon = L.icon({
        iconUrl: iconImage,
        iconSize: [30, 30],
        iconAnchor: [10, 9]
      });
      let marker;
      if (lat && lng !== undefined) {
        marker = L.marker([lat, lng], {
          icon: icon
        });
        this.clusterGroup.addLayer(marker);
        this.markers.push(marker);
        if (type === 'api') {
          const embeddedUrl = `<a href=${url} target=\\"_blank\\"> More Info</a>`;
          marker.bindPopup('Date: ' + date + ' ' + summary + ' | ' + 'shape:  ' + shape +
            ' | ' + 'duration:  ' + duration + ' | ' + city + ' | ' + state + ' | More info: ' + embeddedUrl);
        } else {
          marker.bindPopup('Date: ' + date + ' ' + comments + ' | ' + 'shape:  ' + shape + ' | ' + city);
        }
        marker.on('mouseover', function (e) {
          this.openPopup();
        });
        // marker.on('mouseout', function (e) {
        //   this.closePopup();
        // });
      }
    });
    this.clusterGroup.addTo(this.mymap);
    document.getElementById('apiProgress').style.display = 'none';

    this.mymap.fire('bookmark:add', {
      data: {
        id: 'area51', // make sure it's unique,
        name: 'Famous Area 51 Sightings',
        latlng: [14, -115], // important, we're dealing with JSON here,
        your_key: 'your value'
      }
    });
  }

  lolTest() {
    // 'use strict';
    // function logThis() {
    //   this.desc = 'logger';
    //   console.log(this);
    // }
    // new logThis();
    // console.log(typeof(42));
    // for (var i = 1; i <= 4; i++) {
    //   (function(j){
    //   setTimeout(function() {
    //     console.log(j);
    //   }, j * 1000);
    // })(i);
    // }
  }
}
