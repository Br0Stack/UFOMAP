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
//import 'd3';
declare var require: any
declare var window: any;
declare var xmlNode: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.less']
})
export class MapComponent implements OnInit {
  mymap: any;
  clusterGroup: any;
  xmlNode: any;

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
	attribution: 'www.EdwinGrier.com',
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
  zoomToBoundsOnClick: true,
  //iconCreateFunction: defineClusterIcon
});
var categoryField = '5074';
var rmax = 30;
// function defineClusterIcon(cluster) {
//   var children = cluster.getAllChildMarkers(),
//       n = children.length, //Get number of markers in cluster
//       strokeWidth = 1, //Set clusterpie stroke width
//       r = rmax-2*strokeWidth-(n<10?12:n<100?8:n<1000?4:0), //Calculate clusterpie radius...
//       iconDim = (r+strokeWidth)*2, //...and divIcon dimensions (leaflet really want to know the size)
//       data = d3.nest() //Build a dataset for the pie chart
//         .key(function(d) { return d.feature.properties[categoryField]; })
//         .entries(children, d3.map),
//       //bake some svg markup
//       html = bakeThePie({data: data,
//                           valueFunc: function(d){return d.values.length;},
//                           strokeWidth: 1,
//                           outerRadius: r,
//                           innerRadius: r-10,
//                           pieClass: 'cluster-pie',
//                           pieLabel: n,
//                           pieLabelClass: 'marker-cluster-pie-label',
//                           pathClassFunc: function(d){return "category-"+d.data.key;},
//                           pathTitleFunc: function(d){return metadata.fields[categoryField].lookup[d.data.key]+' ('+d.data.values.length+' accident'+(d.data.values.length!=1?'s':'')+')';}
//                         }),
//       //Create a new divIcon and assign the svg markup to the html property
//       myIcon = new L.DivIcon({
//           html: html,
//           className: 'marker-cluster',
//           iconSize: new L.Point(iconDim, iconDim)
//       });
//   return myIcon;
// }
// function bakeThePie(options) {
//   /*data and valueFunc are required*/
//   if (!options.data || !options.valueFunc) {
//       return '';
//   }
//   var data = options.data,
//       valueFunc = options.valueFunc,
//       r = options.outerRadius?options.outerRadius:28, //Default outer radius = 28px
//       rInner = options.innerRadius?options.innerRadius:r-10, //Default inner radius = r-10
//       strokeWidth = options.strokeWidth?options.strokeWidth:1, //Default stroke is 1
//       pathClassFunc = options.pathClassFunc?options.pathClassFunc:function(){return '';}, //Class for each path
//       pathTitleFunc = options.pathTitleFunc?options.pathTitleFunc:function(){return '';}, //Title for each path
//       pieClass = options.pieClass?options.pieClass:'marker-cluster-pie', //Class for the whole pie
//       pieLabel = options.pieLabel?options.pieLabel:d3.sum(data,valueFunc), //Label for the whole pie
//       pieLabelClass = options.pieLabelClass?options.pieLabelClass:'marker-cluster-pie-label',//Class for the pie label
      
//       origo = (r+strokeWidth), //Center coordinate
//       w = origo*2, //width and height of the svg element
//       h = w,
//       donut = d3.layout.pie(),
//       arc = d3.svg.arc().innerRadius(rInner).outerRadius(r);
      
//   //Create an svg element
//   var svg = document.createElementNS(d3.ns.prefix.svg, 'svg');
//   //Create the pie chart
//   var vis = d3.select(svg)
//       .data([data])
//       .attr('class', pieClass)
//       .attr('width', w)
//       .attr('height', h);
      
//   var arcs = vis.selectAll('g.arc')
//       .data(donut.value(valueFunc))
//       .enter().append('svg:g')
//       .attr('class', 'arc')
//       .attr('transform', 'translate(' + origo + ',' + origo + ')');
  
//   arcs.append('svg:path')
//       .attr('class', pathClassFunc)
//       .attr('stroke-width', strokeWidth)
//       .attr('d', arc)
//       .append('svg:title')
//         .text(pathTitleFunc);
              
//   vis.append('text')
//       .attr('x',origo)
//       .attr('y',origo)
//       .attr('class', pieLabelClass)
//       .attr('text-anchor', 'middle')
//       //.attr('dominant-baseline', 'central')
//       /*IE doesn't seem to support dominant-baseline, but setting dy to .3em does the trick*/
//       .attr('dy','.3em')
//       .text(pieLabel);
//   //Return the svg-markup rather than the actual element
//   return serializeXmlNode(svg);
// }


// function serializeXmlNode(xmlNode) {
//   var s = new XMLSerializer();
//   if (typeof window.s != "undefined") {
//       return (new window.XMLSerializer()).serializeToString(xmlNode);
//   } else if (typeof xmlNode.xml != "undefined") {
//       return xmlNode.xml;
//   }
//   return "";
// }
this.clusterGroup.on('clustermouseover', function (e) {
  e.layer.bindTooltip(e.layer.getAllChildMarkers().length + ' UFO sightings in this area (click)');
  e.layer.openTooltip();
});
var marker = new L.marker([56, -106], { opacity: 0.01 }); //opacity may be set to zero
marker.bindTooltip('Map of UFO Sightings Across the World 1940-2015', {permanent: true, className: 'my-label', offset: [-200, 80] });
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
   //var require: any
    const jsonURL = require('../../assets/csvjson.json');
    //console.log(jsonURL)
    let endTime = new Date('01/12/2010 12:00:00 AM').toUTCString();
    for (let a = 0; a < jsonURL.length; a++) {
      let city = jsonURL[a].city;
      let comments = jsonURL[a].comments;
      let country = jsonURL[a].country;
      let date = jsonURL[a].datetime;
      // var duration = jsonURL[a].duration
      let lat = jsonURL[a].latitude
      let lng = jsonURL[a].longitude
      let shape = jsonURL[a].shape
      //var state = jsonURL[a].state
      //var datetimeEnd = "12/23/2004 07:15"
      //var endTime = new Date('02/12/2013 12:00:00 AM');

      if(shape === 'fireball') {
      var iconImage = 'assets/img/ufo.png';
      }
      else if(shape === 'chevron') {
        var iconImage = 'assets/img/chevron.png';
        }
        else if(shape === 'oval') {
          var iconImage = 'assets/img/oval.png';
          }
          else if(shape === 'formation') {
            var iconImage = 'assets/img/formation.png';
            }
            else if(shape === 'sphere') {
              var iconImage = 'assets/img/sphere.png';
              }
              else if(shape === 'light') {
                var iconImage = 'assets/img/light.png';
                }
                else if(shape === 'rectangle') {
                  var iconImage = 'assets/img/rectangle.png';
                  }
                  else if(shape === 'disk') {
                    var iconImage = 'assets/img/disk.png';
                    }
                    else if(shape === 'changing') {
                      var iconImage = 'assets/img/changing.png';
                      }
                      else if(shape === 'cigar') {
                        var iconImage = 'assets/img/cigar.png';
                        }
                        else if(shape === 'circle') {
                          var iconImage = 'assets/img/circle.png';
                          }
                          else if(shape === 'triangle') {
                            var iconImage = 'assets/img/triangle.png';
                            }
                          else
                          {
                          var iconImage = 'assets/img/sphere.png';
                          }
      var icon = L.icon({
        iconUrl: iconImage,
        iconSize: [30, 30],
        iconAnchor: [10, 9]
      });
     // if( country === 'us' || 'canada' ) {
        let marker = L.marker([lat,lng], {icon: icon});
        this.clusterGroup.addLayer(marker);
        marker.bindPopup('Date: ' + date + ' ' + comments + ' | ' + 'shape:  ' + shape + ' | ' + city);
        marker.on('mouseover', function (e) {
          this.openPopup();
      });
      marker.on('mouseout', function (e) {
          this.closePopup();
      });
     //}

  }
    this.clusterGroup.addTo(this.mymap);
    //this.lolTest();

//Test code for the Jobs Map project:

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
