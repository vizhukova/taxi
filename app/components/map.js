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
var _ = require('lodash');
var place_1 = require('./../providers/place/place');
var cost_1 = require('./../providers/cost/cost');
var map_1 = require('./../providers/map/map');
var Map = (function () {
    function Map(PlaceProvider, MapProvider, http, cost, ref) {
        var _this = this;
        this.PlaceProvider = PlaceProvider;
        this.MapProvider = MapProvider;
        this.http = http;
        this.cost = cost;
        this.ref = ref;
        this.onDragEnd = this.onDragEnd.bind(this);
        this.timeout = this.timeout.bind(this);
        this.coords = {
            from: { latitude: 0, longitude: 0 },
            to: { latitude: 0, longitude: 0 }
        };
        var self = this;
        this.state = { direction: 'from' };
        this.iconFrom = L.icon({
            iconUrl: 'build/res/icon_path_active.png',
            iconSize: [26, 36],
            shadowSize: [26, 36],
            iconAnchor: [15, 19],
            shadowAnchor: [4, 36],
            popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
        });
        this.iconTo = L.icon({
            iconUrl: 'build/res/point.png',
            iconSize: [20, 20],
            shadowSize: [20, 20],
            iconAnchor: [11, 11],
            shadowAnchor: [4, 20],
            popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
        });
        this.markerTo = L.marker([0, 0], { icon: this.iconTo, opacity: 1 });
        this.markerFrom = L.marker([0, 0], { icon: this.iconFrom, opacity: 1 });
        MapProvider.state$.subscribe(function (newState) {
            if (!_this.state.direction && newState.direction) {
                _this.addMarker(newState.direction);
            }
            else if (newState.direction && _this.state.direction !== newState.direction) {
                _this.addMarker(_this.state.direction);
            }
            _this.state = _.assign({}, newState);
            setTimeout(function () {
                self.state = _.assign({}, MapProvider.getState());
                self.ref.tick();
            }, 300);
        });
        PlaceProvider.coords$.subscribe(function (newCoords) {
            _this.MapProvider.set('searching', false);
            self.coords = newCoords;
            _this.calcPolyline(newCoords);
            if (_this.map && newCoords && _this.state.direction) {
                var currentCoordinates = newCoords[_this.state.direction];
                _this.map.setView([
                    currentCoordinates.latitude,
                    currentCoordinates.longitude
                ]);
            }
        });
        //PlaceProvider.reload$.subscribe(name => {
        //    if (self.map && self.selector === name) {
        //        setTimeout(()=> {
        //            self.map.invalidateSize(true);
        //            self.locateMe();
        //        }, 300);
        //    }
        //});
        //
        //
        //PlaceProvider.mapCreate$.subscribe(name => {
        //    self.createMap(name)
        //});
        //
        //PlaceProvider.mapDestroy$.subscribe(name => {
        //    self.destroyMap(name)
        //});
    }
    Map.prototype.addMarker = function (direction) {
        if (this.polyline && this.map.hasLayer(this.markerTo) && this.map.hasLayer(this.markerFrom)) {
            switch (direction) {
                case 'to':
                    this.map.removeLayer(this.markerTo);
                    //this.markerTo.setOpacity(0);
                    this.map.setView(this.markerTo.getLatLng());
                    break;
                case 'from':
                    this.map.removeLayer(this.markerFrom);
                    //this.markerFrom.setOpacity(0);
                    this.map.setView(this.markerFrom.getLatLng());
            }
            return;
        }
        var coords = this.coords[direction].latitude ?
            Map.coordinatesToArray(this.coords[direction]) :
            this.map.getCenter();
        switch (direction) {
            case 'to':
                //this.markerFrom.setOpacity(0);
                //this.markerTo.setOpacity(1);
                if (this.polyline)
                    this.map.setView(this.markerFrom.getLatLng());
                this.map.removeLayer(this.markerFrom);
                this.markerTo.setLatLng(coords);
                this.markerTo.addTo(this.map);
                break;
            case 'from':
                if (this.polyline)
                    this.map.setView(this.markerTo.getLatLng());
                this.map.removeLayer(this.markerTo);
                this.markerFrom.setLatLng(coords);
                this.markerFrom.addTo(this.map);
                //this.markerTo.setOpacity(0);
                //this.markerFrom.setOpacity(1);
                break;
        }
    };
    Map.prototype.markerClasses = function () {
        return {
            marker: true,
            from: this.state.direction === 'from',
            searching: this.state.searching,
            hide: this.state.direction === 'to' && !this.coords.to.latitude
        };
    };
    Map.coordinatesToArray = function (coordinates) {
        return [coordinates.latitude || 0, coordinates.longitude || 0];
    };
    //private isPointExist(name: string): boolean {
    //    let point = this.coords[name];
    //
    //    return point.latitude !== 0 && point.longitude !== 0;
    //}
    Map.prototype.ngAfterViewInit = function () {
        this.createMap(this.selector);
    };
    Map.prototype.timeout = function () {
        var _this = this;
        if (!this.coords.to.latitude && this.state.direction === 'to')
            return;
        if (!this.state.direction)
            return;
        if (this.timer)
            clearTimeout(this.timer);
        this.timer = setInterval(function () {
            _this.onDragEnd();
            clearTimeout(_this.timer);
        }, 1200);
    };
    Map.prototype.createMap = function (name) {
        var _this = this;
        if (this.selector !== name)
            return;
        var osmUrl = 'http://tiles.maps.sputnik.ru//{z}/{x}/{y}.png', osmAttribution = '', osmLayer = new L.TileLayer(osmUrl, { maxZoom: 18, attribution: osmAttribution });
        // Город родной - Питер я твой! [59.928848, 30.311303]
        var mapCoords = this.coords[this.state.direction].length ? this.coords[this.state.direction] : [59.928848, 30.311303];
        if (!this.map) {
            this.map = new L.Map(this.selector, { center: mapCoords, zoom: 15, layers: [osmLayer], zoomControl: false });
        }
        //this.map.on('click', () => {
        //    if(cordova){
        //        cordova.plugins.Keyboard.close();
        //    }
        //});
        //
        //this.map.on('dragstart', () => {
        //    if(cordova){
        //        cordova.plugins.Keyboard.close();
        //    }
        //})
        //
        //
        this.map.on('click', function () {
            _this.MapProvider.set('clicked', !_this.state.clicked);
        });
        if (!this.editable)
            this.map.on('dragstart', function () {
                if (_this.state.direction)
                    _this.MapProvider.set('searching', true);
            });
        if (!this.editable)
            this.map.on('dragend', this.timeout);
        if (!this.editable)
            this.map.on('zoomstart', function () {
                if (_this.state.direction)
                    _this.MapProvider.set('searching', true);
            });
        if (!this.editable)
            this.map.on('zoomend', this.timeout);
        //this.bootMarkers(this.direction);
        setTimeout(function () {
            _this.map.invalidateSize(true);
        }, 300);
        if (this.state.initial)
            this.locateMe();
    };
    Map.prototype.destroyMap = function (name) {
        var map = this.map;
        if (!map || this.selector !== name)
            return;
        try {
            map.clearAllEventListeners();
            map.eachLayer(function (layer) {
                map.removeLayer(layer);
            });
            map.remove();
        }
        catch (e) {
        }
    };
    Map.prototype.calcPolyline = function (coords) {
        var _this = this;
        if (!coords.from || !coords.to)
            return;
        var from = { Lat: coords.from.latitude, Lon: coords.from.longitude };
        var to = { Lat: coords.to.latitude, Lon: coords.to.longitude };
        if (!from.Lat || !from.Lon || !to.Lat || !to.Lon)
            return;
        // this.pathButton.classList.add('loading');
        this.http.post('http://ddtaxity.smarttaxi.ru:8000/1.x/route?taxiserviceid=taxity', [from, to])
            .subscribe(function (res) {
            var data = res.json();
            _this.markPolyline(_this.PlaceProvider.decodeGooglePolyline(data.overviewPolyline));
        });
    };
    Map.prototype.markPolyline = function (path) {
        this.polyline && this.removeLayer(this.polyline);
        this.polyline = L.polyline(path, { color: 'black' }).addTo(this.map);
        this.callEnable(true);
        // this.PlaceProvider.changePathStatus(true);
    };
    Map.prototype.boundsPolyline = function () {
        if (!this.state.direction)
            return;
        if (this.state.direction === 'to') {
            this.markerTo.setLatLng(this.map.getCenter());
            //this.markerTo.setOpacity(1);
            this.markerTo.addTo(this.map);
        }
        else if (this.state.direction === 'from') {
            this.markerFrom.setLatLng(this.map.getCenter());
            //this.markerFrom.setOpacity(1);
            this.markerFrom.addTo(this.map);
        }
        this.MapProvider.set('direction', '');
        this.map.fitBounds(this.polyline.getBounds(), { padding: [50, 50] });
    };
    Map.prototype.locateMe = function () {
        var _this = this;
        if (!this.coords.to.latitude && this.state.direction === 'to')
            return;
        this.MapProvider.set('searching', true);
        this.PlaceProvider.getPosition().then(function (data) {
            _this.map.setView(L.latLng(data.latitude, data.longitude), 16);
            _this.MapProvider.set('searching', false);
            _this.ref.tick();
            _this.onDragEnd();
            _this.map.invalidateSize(true);
        }).catch(function (err) {
            //debugger
        });
    };
    Map.prototype.removeLayer = function (layer) {
        this.map.removeLayer(layer);
        this.polyline = false;
    };
    Map.prototype.onDragEnd = function () {
        var zoom = this.map.getZoom();
        this.map.setZoom(Math.round(zoom));
        var coords = this.map.getCenter();
        this.PlaceProvider.getCurrentAddress({
            latitude: coords.lat,
            longitude: coords.lng
        });
        if (this.polyline) {
            this.removeLayer(this.polyline);
            this.PlaceProvider.changePathStatus(false);
            this.callEnable(false);
        }
        this.map.invalidateSize(true);
    };
    Map.prototype.ngOnDestroy = function () {
        this.destroyMap(this.selector);
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
        __metadata('design:type', String)
    ], Map.prototype, "selector", void 0);
    __decorate([
        core_2.Input(), 
        __metadata('design:type', Function)
    ], Map.prototype, "callEnable", void 0);
    Map = __decorate([
        core_1.Component({
            selector: 'map',
            template: "<div id=\"map-wrap\">\n        <span *ngIf=\"state.direction\" [ngClass]=\"markerClasses()\"></span>\n        <div id=\"{{selector}}\"></div>\n        <div class=\"btn locate\" (click)=\"locateMe()\"></div>\n        <div (click)=\"boundsPolyline()\" *ngIf=\"coords.to.latitude\" class=\"btn center\"></div>\n    </div>"
        }), 
        __metadata('design:paramtypes', [place_1.Place, map_1.MapProvider, http_1.Http, cost_1.Cost, core_1.ApplicationRef])
    ], Map);
    return Map;
})();
exports.Map = Map;
