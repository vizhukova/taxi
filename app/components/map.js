var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var core_2 = require('@angular/core');
var http_1 = require('@angular/http');
var L = require('leaflet');
var place_1 = require('./../providers/place/place');
var Map = (function () {
    function Map(PlaceProvider, http) {
        var _this = this;
        this.PlaceProvider = PlaceProvider;
        this.http = http;
        this.onDragEnd = this.onDragEnd.bind(this);
        this.coords = {
            from: [],
            to: []
        };
        this.direction = 'from';
        var self = this;
        this.iconFrom = L.icon({
            iconUrl: 'build/res/icon_path_active.png',
            iconSize: [26, 36],
            shadowSize: [26, 36],
            iconAnchor: [26, 36],
            shadowAnchor: [4, 36],
            popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
        });
        this.iconTo = L.icon({
            iconUrl: 'build/res/point.png',
            iconSize: [20, 20],
            shadowSize: [20, 20],
            iconAnchor: [20, 20],
            shadowAnchor: [4, 20],
            popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
        });
        this.pathBtn = L.Control.extend({
            options: {
                position: 'bottomright'
            },
            onAdd: function (map) {
                var container = L.DomUtil.create('div', 'nav-panel');
                var locate = L.DomUtil.create('div', 'locate-button', container);
                var path = L.DomUtil.create('div', 'calcpath-button', container);
                path.addEventListener('click', function () { self.calcPolyline(self.coords); });
                locate.addEventListener('click', function () { self.locateMe(); });
                return container;
            }
        });
        this.markerTo = L.marker([0, 0]);
        this.markerFrom = L.marker([0, 0]);
        PlaceProvider.coords$.subscribe(function (newCoords) {
            self.coords = newCoords;
        });
        PlaceProvider.direction$.subscribe(function (newDirection) {
            _this.direction = newDirection;
            if (_this.map)
                _this.bootMarkers(newDirection);
        });
    }
    Map.prototype.markerClasses = function () {
        return {
            marker: true,
            from: this.direction === 'from'
        };
    };
    Map.prototype.bootMarkers = function (direction) {
        var markerFromCoords = this.coords.from.length ? this.coords.from : this.map.getCenter();
        var markerToCoords = this.coords.to.length ? this.coords.to : this.map.getCenter();
        if (direction === 'to') {
            if (!this.map.hasLayer(this.markerFrom)) {
                this.markerFrom = L.marker(markerFromCoords, { icon: this.iconFrom, opacity: this.coords.from.length ? 1 : 0 }).addTo(this.map);
            }
            else {
                this.markerFrom.setLatLng(markerFromCoords);
                this.markerTo.setOpacity(0);
                this.markerFrom.setOpacity(1);
                this.map.setView(markerToCoords);
            }
        }
        else if (direction === 'from') {
            if (!this.map.hasLayer(this.markerTo)) {
                this.markerTo = L.marker(markerToCoords, { icon: this.iconTo, opacity: this.coords.to.length ? 1 : 0 }).addTo(this.map);
            }
            else {
                this.markerTo.setLatLng(markerToCoords);
                this.markerTo.setOpacity(1);
                this.markerFrom.setOpacity(0);
                this.map.setView(markerFromCoords);
            }
        }
    };
    Map.prototype.ngAfterViewInit = function () {
        var _this = this;
        var osmUrl = 'http://tiles.maps.sputnik.ru//{z}/{x}/{y}.png', osmAttribution = '', osmLayer = new L.TileLayer(osmUrl, { maxZoom: 18, attribution: osmAttribution });
        var mapCoords = this.coords[this.direction].length ? this.coords[this.direction] : [58.5, 37.7];
        this.map = new L.Map('mapid', { center: mapCoords, zoom: 7, layers: [osmLayer], zoomControl: false });
        if (!this.editable)
            this.map.on('dragend', this.onDragEnd);
        if (!this.editable)
            this.map.on('zoomend', this.onDragEnd);
        if (!this.editable)
            this.map.addControl(new this.pathBtn());
        this.bootMarkers(this.direction);
        setTimeout(function () { _this.map.invalidateSize(true); }, 300);
        if (this.coords && !this.coords.from && !this.coords.to)
            this.locateMe();
    };
    Map.prototype.calcPolyline = function (coords) {
        var _this = this;
        if (!coords.from || !coords.to)
            return;
        var from = { Lat: coords.from[0], Lon: coords.from[1] };
        var to = { Lat: coords.to[0], Lon: coords.to[1] };
        this.http.post('http://ddtaxity.smarttaxi.ru:8000/1.x/route?taxiserviceid=taxity', [from, to])
            .subscribe(function (res) {
            var data = res.json();
            _this.markPolyline(_this.PlaceProvider.decodeGooglePolyline(data.overviewPolyline));
        });
    };
    Map.prototype.locateMe = function () {
        var _this = this;
        this.PlaceProvider.getPosition().then(function (data) {
            _this.map.setView(L.latLng(data.latitude, data.longitude), 16);
            _this.onDragEnd();
        }).catch(function (err) {
            //debugger
        });
    };
    Map.prototype.markPolyline = function (path) {
        this.polyline && this.removeLayer(this.polyline);
        this.polyline = L.polyline(path, { color: 'black' }).addTo(this.map);
        this.callEnable();
    };
    Map.prototype.removeLayer = function (layer) {
        this.map.removeLayer(layer);
    };
    Map.prototype.onDragEnd = function () {
        var zoom = this.map.getZoom();
        this.map.setZoom(Math.round(zoom));
        var coords = this.map.getCenter();
        this.PlaceProvider.getCurrentAddress({
            latitude: coords.lat,
            longitude: coords.lng
        });
    };
    __decorate([
        core_2.Input(), 
        __metadata('design:type', Function)
    ], Map.prototype, "callback", void 0);
    __decorate([
        core_2.Input(), 
        __metadata('design:type', Boolean)
    ], Map.prototype, "editable", void 0);
    __decorate([
        core_2.Input(), 
        __metadata('design:type', Object)
    ], Map.prototype, "path", void 0);
    __decorate([
        core_2.Input(), 
        __metadata('design:type', Function)
    ], Map.prototype, "callEnable", void 0);
    Map = __decorate([
        core_1.Component({
            selector: 'map',
            template: "<div id=\"map-wrap\">\n        <span [ngClass]=\"markerClasses()\"></span>\n        <div id=\"mapid\"></div>\n    </div>" }), 
        __metadata('design:paramtypes', [place_1.Place, http_1.Http])
    ], Map);
    return Map;
})();
exports.Map = Map;
