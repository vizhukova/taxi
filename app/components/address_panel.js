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
//import {Observable} from "rxjs/Rx";
var place_1 = require("../providers/place/place");
var map_1 = require("../providers/map/map");
var gather_order_1 = require('./../providers/order/gather_order');
var ionic_angular_1 = require('ionic-angular');
var search_1 = require("../pages/search/search");
var popup_1 = require("../pages/search-tab/favorite_popup/popup");
var nav_1 = require("../providers/nav/nav");
//import {AddressItem} from "../interfaces/address";
var address_1 = require("../providers/address/address");
var rxjs_1 = require('rxjs');
var Address = (function () {
    function Address(nav, GatherOrderProvider, AddressProvider, MapProvider, place, http, NavProvider) {
        this.nav = nav;
        this.GatherOrderProvider = GatherOrderProvider;
        this.AddressProvider = AddressProvider;
        this.MapProvider = MapProvider;
        this.place = place;
        this.http = http;
        this.NavProvider = NavProvider;
        var self = this;
        this.address = { from: '', to: '' };
        this.confirmedAddresses = { from: '', to: '' };
        this.direction = 'from';
        this.addresses = [];
        this.search = false;
        this.detail = false;
        this.clicked = false;
        this.state = {};
        this.disabled = {
            from: true,
            to: true
        };
        this.test = Math.random();
        this.coords = {
            from: { latitude: 0, longitude: 0 },
            to: { latitude: 0, longitude: 0 }
        };
        place.address$.subscribe(function (newAddress) {
            self.address = newAddress;
            if (newAddress.to) {
                GatherOrderProvider.setDestination(newAddress.to);
            }
            if (newAddress.from) {
                GatherOrderProvider.setSource(newAddress.from);
            }
        });
        MapProvider.state$.subscribe(function (newState) {
            self.direction = newState.direction;
            if (newState.clicked !== self.clicked && newState.editable && newState.searching) {
                self.onConfirm();
            }
            self.clicked = newState.clicked;
        });
        place.coords$.subscribe(function (newCoords) {
            self.coords = newCoords;
        });
    }
    Address.prototype.ngAfterViewInit = function () {
        // if(this.view) {
        //     this.getAll(this.address[this.direction]);
        //     this.editable[this.direction] = false;
        // }
        var _this = this;
        // this.vc.nativeElement.focus();
        document.addEventListener('backbutton', function () {
            _this.onConfirm();
        }, false);
    };
    Address.prototype.clearAddress = function (event) {
        event.stopPropagation();
        // this.search = false;
        // this.detail = false;
        this.address[this.direction] = '';
        this.place.changeAddress(this.address);
        // this.NavProvider.changeTabSet('main');
    };
    Address.prototype.confirmAddress = function (index) {
        var address = this.addresses[index];
        var addressCoordinates = address['geoPoint'];
        var newCoords = {
            latitude: addressCoordinates.lat,
            longitude: addressCoordinates.lon
        };
        this.address[this.direction] = address['shortAddress'];
        this.coords[this.direction] = newCoords;
        this.place.changeAddress(this.address);
        this.place.changeCoords(this.coords);
        this.place.reloadMap('homeMap');
        // this.editable[this.direction] = true;
        this.search = false;
        // this.detail = true;
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
        var lat = this.coords[this.direction].latitude;
        var lon = this.coords[this.direction].longitude;
        var url = "http://ddtaxity.smarttaxi.ru:8000/1.x/geocode?taxiServiceId=taxity&radius=2000&lat=" + lat + "&lon=" + lon + "&search=" + search;
        return this.http.get(url)
            .map(Address.extractData)
            .catch(Address.handleError);
    };
    Address.prototype.getAll = function (address) {
        if (address.length < 3)
            return;
        var self = this;
        self.addresses = self.formatAddressesSearch(address, [{ "geoPoint": { "lon": 37.358859, "lat": 55.835406 }, "fullAddress": "Россия, Московская область," +
                    " Москва," +
                    " Генерала Белобородова ул.", "shortAddress": "Генерала Белобородова ул.", "placeType": "Unknown", "title": "", "country": "Россия", "region": "Московская" +
                    " область", "county": "", "city": "Москва", "district": "", "street": "Генерала Белобородова ул.", "house": "", "housing": "", "structure": "", "porch": "" }]);
        self.search = true;
        //this.getAddresses(address)
        //    .subscribe(
        //        (addresses) => {
        //            self.addresses = self.formatAddressesSearch(address, addresses);
        //            self.search = true;
        //        },
        //        error => console.log(error)
        //    )
    };
    Address.prototype.formatAddressesSearch = function (address, addresses) {
        return addresses.map(function (item) {
            if (item.street.toLowerCase().indexOf(address.toLowerCase()) < 0) {
                item.street = [{ text: item.street || item['shortAddress'], className: 'white' }];
                return item;
            }
            var formated = [];
            var splited = item.street.toLowerCase().split(address.toLowerCase());
            var index = splited.indexOf('');
            if (index === 0) {
                formated.push({ text: address, className: 'orange' });
                formated.push({ text: splited[1], className: 'white' });
            }
            else if (index === 1) {
                formated.push({ text: splited[0], className: 'white' });
                formated.push({ text: address, className: 'orange' });
            }
            else {
                formated.push({ text: splited[0], className: 'white' });
                formated.push({ text: address, className: 'orange' });
                formated.push({ text: splited[1], className: 'white' });
            }
            item.street = formated;
            return item;
        });
    };
    Address.extractData = function (res) {
        var body = res.json();
        return body || {};
    };
    Address.handleError = function (error) {
        var errMsg = (error.message) ? error.message :
            error.status ? error.status + " - " + error.statusText : 'Server error';
        console.error(errMsg);
        return rxjs_1.Observable.throw(errMsg);
    };
    Address.prototype.onFocus = function (type, input) {
        if (this.direction === type && this.detail) {
            this.disabled[type] = false;
            setTimeout(function () {
                input.focus();
                if (cordova)
                    cordova.plugins.Keyboard.show();
            }, 150);
        }
        else if (type === 'to' && !this.address.to) {
            this.NavProvider.changeTabSet('search');
            this.MapProvider.set('editable', true);
            this.MapProvider.set('searching', true);
            this.detail = true;
        }
        if (this.direction === type && this.NavProvider.getCurrentTabSet() === 'main') {
            this.NavProvider.changeTabSet('search');
            this.MapProvider.set('editable', true);
            this.MapProvider.set('searching', true);
            this.detail = true;
        }
        this.direction = type;
        this.MapProvider.set('direction', type);
        //this.place.changeDirection(type);
    };
    Address.prototype.showFavoritePopup = function () {
        this.AddressProvider.changeFavoriteAddress({ house: this.house, housing: this.block, description: this.comment });
        this.nav.push(popup_1.FavoritePopup);
    };
    Address.prototype.onConfirm = function () {
        this.search = false;
        this.detail = false;
        this.disabled[this.direction] = true;
        this.NavProvider.changeTabSet('main');
        this.MapProvider.set('searching', false);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], Address.prototype, "view", void 0);
    __decorate([
        core_1.ViewChild('from'), 
        __metadata('design:type', Object)
    ], Address.prototype, "vc", void 0);
    Address = __decorate([
        core_1.Component({
            selector: 'address',
            templateUrl: 'build/templates/address_panel.html',
            directives: [search_1.SearchPage]
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController, gather_order_1.GatherOrder, address_1.AddressProvider, map_1.MapProvider, place_1.Place, http_1.Http, nav_1.Nav])
    ], Address);
    return Address;
})();
exports.Address = Address;
