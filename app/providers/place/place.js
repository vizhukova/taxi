var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ionic_native_1 = require('ionic-native');
var core_1 = require('@angular/core');
// import 'rxjs/add/operator/map';
var rxjs_1 = require('rxjs');
var http_1 = require('@angular/http');
var Place = (function () {
    function Place(http) {
        this.http = http;
        // Observable data sources
        this.addressSource = new rxjs_1.BehaviorSubject({ from: '', to: '' });
        this.coordsSource = new rxjs_1.BehaviorSubject({ from: [], to: [] });
        this.directionSource = new rxjs_1.BehaviorSubject('from');
        // Observable data streams
        this.address$ = this.addressSource.asObservable();
        this.coords$ = this.coordsSource.asObservable();
        this.direction$ = this.directionSource.asObservable();
        this.coords = {
            from: [],
            to: []
        };
        this.address = {
            from: '',
            to: ''
        };
        this.direction = 'from';
    }
    // Service message commands
    Place.prototype.changeAddress = function (address) {
        this.addressSource.next(address);
    };
    Place.prototype.changeCoords = function (coords) {
        this.coordsSource.next(coords);
    };
    Place.prototype.changeDirection = function (direction) {
        this.direction = direction;
        this.directionSource.next(direction);
    };
    Place.prototype.getPosition = function () {
        var self = this;
        return new Promise(function (resolve, reject) {
            ionic_native_1.Geolocation.getCurrentPosition().then(function (resp) {
                self.coords[self.direction] = resp.coords;
                self.changeCoords(self.coords);
                resolve(self.coords[self.direction]);
            }, function (err) { reject(err); });
        });
    };
    Place.prototype.get = function (property) {
        return this[property];
    };
    Place.prototype.decodeGooglePolyline = function (str, precision) {
        var index = 0, lat = 0, lng = 0, coordinates = [], shift = 0, result = 0, byte = null, latitude_change, longitude_change, factor = Math.pow(10, precision || 5);
        // Coordinates have variable length when encoded, so just keep
        // track of whether we've hit the end of the string. In each
        // loop iteration, a single coordinate is decoded.
        while (index < str.length) {
            // Reset shift, result, and byte
            byte = null;
            shift = 0;
            result = 0;
            do {
                byte = str.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);
            latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));
            shift = result = 0;
            do {
                byte = str.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);
            longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lat += latitude_change;
            lng += longitude_change;
            coordinates.push([lat / factor, lng / factor]);
        }
        return coordinates;
    };
    Place.prototype.getCurrentAddress = function (coords) {
        var self = this;
        self.coords[self.direction] = [coords.latitude, coords.longitude];
        self.changeCoords(self.coords);
        return new Promise(function (resolve, reject) {
            self.http.get("http://maps.googleapis.com/maps/api/geocode/json?latlng=" + coords.latitude + "," + coords.longitude + "&sensor=true&language=ru")
                .subscribe(function (res) {
                var data = res.json();
                self.address[self.direction] = data.results[0].address_components[1].long_name + ", " + data.results[0].address_components[0].long_name;
                self.changeAddress(self.address);
            });
        });
    };
    Place = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], Place);
    return Place;
})();
exports.Place = Place;
