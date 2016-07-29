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
var http_1 = require('@angular/http');
var Rx_1 = require("rxjs/Rx");
var place_1 = require("../providers/place/place");
var ionic_angular_1 = require('ionic-angular');
var search_1 = require("../pages/search/search");
var popup_1 = require("../pages/search-tab/favorite_popup/popup");
var Address = (function () {
    function Address(place, http, nav) {
        this.place = place;
        this.http = http;
        this.nav = nav;
        this.nav = nav;
        var self = this;
        this.address = { from: '', to: '' };
        this.direction = 'from';
        this.addresses = [];
        this.search = false;
        this.detail = false;
        this.editable = {
            from: true,
            to: true
        };
        place.address$.subscribe(function (newAdress) {
            self.address = newAdress;
        });
        place.direction$.subscribe(function (newDirection) {
            self.direction = newDirection;
        });
        place.coords$.subscribe(function (newCoords) {
            self.coords = newCoords;
        });
    }
    Address.prototype.ngAfterViewInit = function () {
        if (this.view) {
            this.getAll(this.address[this.direction]);
            this.editable[this.direction] = false;
        }
    };
    Address.prototype.clearAddress = function () {
        this.address[this.direction] = '';
        this.place.changeAddress(this.address);
    };
    Address.prototype.confirmAddress = function (index) {
        var newCoords = [this.addresses[index].geoPoint.lat, this.addresses[index].geoPoint.lon];
        this.address[this.direction] = this.addresses[index].shortAddress;
        this.coords[this.direction] = newCoords;
        this.place.changeAddress(this.address);
        this.place.changeCoords(this.coords);
        this.editable[this.direction] = true;
        this.search = false;
        this.detail = true;
    };
    Address.prototype.setClasses = function (direction) {
        return {
            from: direction === 'from',
            to: direction === 'to',
            active: this.direction === direction
        };
    };
    Address.prototype.setViewClasses = function () {
        return {
            from: this.direction === 'from',
            searchView: true,
            to: this.direction === 'to'
        };
    };
    Address.prototype.setDetailClasses = function () {
        return {
            addressDetail: true,
            from: this.direction === 'from',
            to: this.direction === 'to'
        };
    };
    Address.prototype.getAddresses = function (search) {
        var lat = this.coords[this.direction][0];
        var lon = this.coords[this.direction][1];
        var url = "http://ddtaxity.smarttaxi.ru:8000/1.x/geocode?taxiServiceId=taxity&radius=2000&lat=" + lat + "&lon=" + lon + "&search=" + search;
        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    };
    Address.prototype.getAll = function (address) {
        if (address.length < 3)
            return;
        var self = this;
        this.getAddresses(address)
            .subscribe(function (addresses) {
            self.addresses = self.formatAddressesSearch(address, addresses);
            self.search = true;
        }, function (error) { return console.log(error); });
    };
    Address.prototype.formatAddressesSearch = function (address, addresses) {
        return addresses.map(function (item) {
            if (item.street.toLowerCase().indexOf(address.toLowerCase()) < 0) {
                item.street = [{ text: item.street || item.shortAddress, class: 'white' }];
                return item;
            }
            var formated = [];
            var splited = item.street.toLowerCase().split(address.toLowerCase());
            var index = splited.indexOf('');
            if (index === 0) {
                formated.push({ text: address, class: 'orange' });
                formated.push({ text: splited[1], class: 'white' });
            }
            else if (index === 1) {
                formated.push({ text: splited[0], class: 'white' });
                formated.push({ text: address, class: 'orange' });
            }
            else {
                formated.push({ text: splited[0], class: 'white' });
                formated.push({ text: address, class: 'orange' });
                formated.push({ text: splited[1], class: 'white' });
            }
            item.street = formated;
            return item;
        });
    };
    Address.prototype.enableEditable = function (direction) {
    };
    Address.prototype.extractData = function (res) {
        var body = res.json();
        return body || {};
    };
    Address.prototype.handleError = function (error) {
        var errMsg = (error.message) ? error.message :
            error.status ? error.status + " - " + error.statusText : 'Server error';
        console.error(errMsg); // log to console instead
        return Rx_1.Observable.throw(errMsg);
    };
    Address.prototype.onFocus = function (type) {
        if (!this.editable[type])
            return;
        this.place.changeDirection(type);
    };
    Address.prototype.showSearchTabs = function () {
        this.nav.push(search_1.SearchPage);
    };
    Address.prototype.showFavoritePopup = function () {
        this.nav.push(popup_1.FavoritePopup);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], Address.prototype, "view", void 0);
    Address = __decorate([
        core_1.Component({
            selector: 'address',
            templateUrl: 'build/templates/address_panel.html'
        }), 
        __metadata('design:paramtypes', [place_1.Place, http_1.Http, ionic_angular_1.NavController])
    ], Address);
    return Address;
})();
exports.Address = Address;
