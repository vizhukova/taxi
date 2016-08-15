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
var _ = require('lodash');
var history_1 = require('./../../providers/order/history');
var place_1 = require('./../../providers/place/place');
var nav_1 = require('./../../providers/nav/nav');
/*
  Generated class for the TimeTabPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var TimeTabPage = (function () {
    function TimeTabPage(OrderHistoryProvider, PlaceProvider, NavProvider) {
        var _this = this;
        this.OrderHistoryProvider = OrderHistoryProvider;
        this.PlaceProvider = PlaceProvider;
        this.NavProvider = NavProvider;
        this.address = true;
        this.header = 'Прошлые поездки';
        this.trips = this.OrderHistoryProvider.get();
        this.addresses = [];
        var uniq = [];
        this.trips.map(function (t) {
            var from = t.source;
            var to = t.destinations[0];
            if (uniq.indexOf(from.shortAddress) === -1) {
                _this.addresses.push({ data: { street: from.shortAddress, geo: { lat: from.lat, lon: from.lon } } });
                uniq.push(from.shortAddress);
            }
            if (uniq.indexOf(to.shortAddress) === -1) {
                _this.addresses.push({ data: { street: to.shortAddress, geo: { lat: to.lat, lon: to.lon } } });
                uniq.push(to.shortAddress);
            }
        });
        //this.addresses = [
        //  {title: "Дом", data: {street: 'Комсомольская 69, п.1'}},
        //  {title: "Моя работа", data: {street: 'Петрозаводская 45'}},
        //  {title: "Работа жены", data: {street: 'Комсомольская 69, п.1'}},
        //  {title: "Работа жены", data: {street: 'Томсомольская 69, п.1'}},
        //  {title: "Работа жены", data: {street: 'Ромсомольская 69, п.1'}},
        //  {title: "Работа жены", data: {street: 'Номсомольская 69, п.1'}},
        //  {title: "Работа жены", data: {street: 'Акомсомольская 69, п.1'}},
        //  {title: "Работа жены", data: {street: 'Сомсомольская 69, п.1'}},
        //  {title: "Детский сад", data: {street: 'Фетрозаводская 45'}}
        //];
        this.addresses = _.groupBy(this.addresses, function (a) {
            return a.data.street.charAt(0).toUpperCase();
        });
        this.alphabet = Object.keys(this.addresses);
    }
    TimeTabPage.prototype.toggleView = function () {
        this.address = !this.address;
    };
    TimeTabPage.prototype.setAddress = function (index, char) {
        var address = this.addresses[char][index].data.geo;
        var curCoord = this.PlaceProvider.getCurrentCoords();
        curCoord[this.PlaceProvider.getDirection()] = {
            longitude: address.lon,
            latitude: address.lat
        };
        this.PlaceProvider.changeCoords(curCoord);
        this.NavProvider.changeTab('home');
    };
    TimeTabPage = __decorate([
        core_1.Component({
            selector: 'time-tab-page',
            templateUrl: 'build/pages/time-tab/time-tab.html',
        }), 
        __metadata('design:paramtypes', [history_1.OrderHistory, place_1.Place, nav_1.Nav])
    ], TimeTabPage);
    return TimeTabPage;
})();
exports.TimeTabPage = TimeTabPage;
