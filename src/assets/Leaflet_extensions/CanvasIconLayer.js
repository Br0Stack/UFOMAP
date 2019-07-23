import * as Rbush from "rbush";
import { Browser, DomUtil, Layer, setOptions, Util } from "../../Leaflet/dist/leaflet-src.esm";

export default Layer.extend({

  // Add event listeners to initialized section.
  initialize(options) {
    setOptions(this, options);
    this._onClickListeners = [];
    this._onHoverListeners = [];
  },

  setOptions(options) {
    setOptions(this, options);
    return this.redraw();
  },

  redraw() {
    this._redraw(true);
  },

  // Multiple layers at a time for rBush performance
  addMarkers(markers) {
    const tmpMark = [];
    const tmpLatLng = [];

    markers.forEach((marker) => {
      if (!((marker.options.pane === "markerPane") && marker.options.icon)) {
        console.error("Layer isn't a marker");
        return;
      }

      const latlng = marker.getLatLng();
      const isDisplaying = this._map.getBounds().contains(latlng);
      const s = this._addMarker(marker, latlng, isDisplaying);

      // Only add to Point Lookup if we are on map
      if (isDisplaying === true) tmpMark.push(s[0]);

      tmpLatLng.push(s[1]);
    });

    this._markers.load(tmpMark);
    this._latlngMarkers.load(tmpLatLng);
  },

  // Adds single layer at a time. Less efficient for rBush
  addMarker(marker) {
    const latlng = marker.getLatLng();
    const isDisplaying = this._map.getBounds().contains(latlng);
    const dat = this._addMarker(marker, latlng, isDisplaying);

    // Only add to Point Lookup if we are on map
    if (isDisplaying === true) this._markers.insert(dat[0]);

    this._latlngMarkers.insert(dat[1]);
  },

  addLayer(layer) {
    if ((layer.options.pane === "markerPane") && layer.options.icon) this.addMarker(layer);
    else console.error("Layer isn't a marker");
  },

  addLayers(layers) {
    this.addMarkers(layers);
  },

  removeLayer(layer) {
    this.removeMarker(layer, true);
  },

  removeMarker(marker, redraw) {
    // If we are removed point
    if (marker.minX) marker = marker.data;

    const latlng = marker.getLatLng();
    const isDisplaying = this._map.getBounds().contains(latlng);

    const markerData = {

      minX: latlng.lng,
      minY: latlng.lat,
      maxX: latlng.lng,
      maxY: latlng.lat,
      data: marker,
    };

    this._latlngMarkers.remove(markerData, (a, b) => a.data._leaflet_id === b.data._leaflet_id);

    this._latlngMarkers.total--;
    this._latlngMarkers.dirty++;

    if (isDisplaying === true && redraw === true) {
      this._redraw(true);
    }
  },

  onAdd(map) {
    this._map = map;

    if (!this._canvas) this._initCanvas();

    if (this.options.pane) this.getPane().appendChild(this._canvas);
    else map._panes.overlayPane.appendChild(this._canvas);

    map.on("moveend", this._reset, this);
    map.on("resize", this._reset, this);

    map.on("click", this._executeListeners, this);
    map.on("mousemove", this._executeListeners, this);
  },

  onRemove(map) {
    if (this.options.pane) this.getPane().removeChild(this._canvas);
    else map.getPanes().overlayPane.removeChild(this._canvas);
  },

  addTo(map) {
    map.addLayer(this);
    return this;
  },

  _addMarker(marker, latlng, isDisplaying) {
    // Needed for pop-up & tooltip to work.
    marker._map = this._map;

    // _markers contains Points of markers currently displaying on map
    if (!this._markers) this._markers = new Rbush();

    // _latlngMarkers contains Lat\Long coordinates of all markers in layer.
    if (!this._latlngMarkers) {
      this._latlngMarkers = new Rbush();
      this._latlngMarkers.dirty = 0;
      this._latlngMarkers.total = 0;
    }

    Util.stamp(marker);

    const pointPos = this._map.latLngToContainerPoint(latlng);
    const iconSize = marker.options.icon.options.iconSize;

    const adjX = iconSize[0] / 2;
    const adjY = iconSize[1] / 2;
    const ret = [({
      minX: (pointPos.x - adjX),
      minY: (pointPos.y - adjY),
      maxX: (pointPos.x + adjX),
      maxY: (pointPos.y + adjY),
      data: marker,
    }), ({
        minX: latlng.lng,
        minY: latlng.lat,
        maxX: latlng.lng,
        maxY: latlng.lat,
        data: marker,
      })];

    this._latlngMarkers.dirty++;
    this._latlngMarkers.total++;

    // Only draw if we are on map
    if (isDisplaying === true) this._drawMarker(marker, pointPos);

    return ret;
  },

  _drawMarker(marker, pointPos) {
    if (!this._imageLookup) this._imageLookup = {};
    if (!pointPos) {
      pointPos = this._map.latLngToContainerPoint(marker.getLatLng());
    }

    const iconUrl = marker.options.icon.options.iconUrl;

    if (marker.canvas_img) {
      this._drawImage(marker, pointPos);
    } else if (this._imageLookup[iconUrl]) {
      marker.canvas_img = this._imageLookup[iconUrl][0];

      if (this._imageLookup[iconUrl][1] === false) {
        this._imageLookup[iconUrl][2].push([marker, pointPos]);
      } else {
        this._drawImage(marker, pointPos);
      }
    } else {
      const i = new Image();
      i.src = iconUrl;
      marker.canvas_img = i;

      // Image,isLoaded,marker\pointPos ref
      this._imageLookup[iconUrl] = [i, false, [[marker, pointPos]]];

      i.onload = () => {
        this._imageLookup[iconUrl][1] = true;
        this._imageLookup[iconUrl][2].forEach((e) => {
          this._drawImage(e[0], e[1]);
        });
      };
    }
  },

  _drawImage(marker, pointPos) {
    const options = marker.options.icon.options;

    this._context.drawImage(
      marker.canvas_img,
      pointPos.x - options.iconAnchor[0],
      pointPos.y - options.iconAnchor[1],
      options.iconSize[0],
      options.iconSize[1],
    );
  },

  _reset() {
    const topLeft = this._map.containerPointToLayerPoint([0, 0]);
    DomUtil.setPosition(this._canvas, topLeft);

    const size = this._map.getSize();

    this._canvas.width = size.x;
    this._canvas.height = size.y;

    this._redraw();
  },

  _redraw(clear) {
    if (!this._map) return;
    if (clear) this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);

    let tmp = [];

    // If we are 10% individual inserts\removals, reconstruct lookup for efficiency
    if (this._latlngMarkers.dirty / this._latlngMarkers.total >= 0.1) {
      this._latlngMarkers.all().forEach((e) => {
        tmp.push(e);
      });

      this._latlngMarkers.clear();
      this._latlngMarkers.load(tmp);
      this._latlngMarkers.dirty = 0;
      tmp = [];
    }

    const mapBounds = this._map.getBounds();

    // Only re-draw what we are showing on the map.

    const mapBoxCoords = {

      minX: mapBounds.getWest(),
      minY: mapBounds.getSouth(),
      maxX: mapBounds.getEast(),
      maxY: mapBounds.getNorth(),
    };

    this._latlngMarkers.search(mapBoxCoords).forEach((e) => {
      // Readjust Point Map
      const pointPos = this._map.latLngToContainerPoint(e.data.getLatLng());

      const iconSize = e.data.options.icon.options.iconSize;
      const adjX = iconSize[0] / 2;
      const adjY = iconSize[1] / 2;

      const newCoords = {
        minX: (pointPos.x - adjX),
        minY: (pointPos.y - adjY),
        maxX: (pointPos.x + adjX),
        maxY: (pointPos.y + adjY),
        data: e.data,
      };

      tmp.push(newCoords);

      // Redraw points
      this._drawMarker(e.data, pointPos);
    });

    // Clear rBush & Bulk Load for performance
    this._markers.clear();
    this._markers.load(tmp);
  },

  _initCanvas() {
    this._canvas = DomUtil.create("canvas", "leaflet-canvas-icon-layer leaflet-layer");
    const originProp = DomUtil.testProp(["transformOrigin", "WebkitTransformOrigin", "msTransformOrigin"]);
    this._canvas.style[originProp] = "50% 50%";

    const size = this._map.getSize();
    this._canvas.width = size.x;
    this._canvas.height = size.y;

    this._context = this._canvas.getContext("2d");

    const animated = this._map.options.zoomAnimation && Browser.any3d;
    DomUtil.addClass(this._canvas, `leaflet-zoom-${animated ? "animated" : "hide"}`);
  },

  addOnClickListener(listener) {
    this._onClickListeners.push(listener);
  },

  addOnHoverListener(listener) {
    this._onHoverListeners.push(listener);
  },

  _executeListeners(event) {
    const x = event.containerPoint.x;
    const y = event.containerPoint.y;

    if (this._openToolTip) {
      this._openToolTip.closeTooltip();
      delete this._openToolTip;
    }

    const ret = this._markers ? this._markers.search({
      minX: x, minY: y, maxX: x, maxY: y,
    }) : undefined;

    if (ret && ret.length > 0) {
      this._map._container.style.cursor = "pointer";

      if (event.type === "click") {
        const hasPopup = ret[0].data.getPopup();
        if (hasPopup) ret[0].data.openPopup();

        this._onClickListeners.forEach((listener) => { listener(event, ret); });
      }

      if (event.type === "mousemove") {
        const hasTooltip = ret[0].data.getTooltip();
        if (hasTooltip) {
          this._openToolTip = ret[0].data;
          ret[0].data.openTooltip();
        }

        this._onHoverListeners.forEach((listener) => { listener(event, ret); });
      }
    } else {
      this._map._container.style.cursor = "";
    }
  },
});


function serializeXmlNode(xmlNode) {
  if (typeof window.XMLSerializer != "undefined") {
      return (new window.XMLSerializer()).serializeToString(xmlNode);
  } else if (typeof xmlNode.xml != "undefined") {
      return xmlNode.xml;
  }
  return "";
}

https://www.linkedin.com/in/garrett-hughes-5320626b/
