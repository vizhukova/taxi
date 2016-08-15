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
require('rxjs/add/operator/map');
var rxjs_1 = require('rxjs');
var place_1 = require("../place/place");
var config_1 = require('./../../config');
var Cost = (function () {
    function Cost(http, place) {
        var _this = this;
        this.http = http;
        this.place = place;
        this.costSource = new rxjs_1.BehaviorSubject(null);
        this.cost$ = this.costSource.asObservable();
        place.coords$.subscribe(function (newCoords) {
            _this.getCost(newCoords);
        });
    }
    /**
     * Make server connect
     */
    Cost.prototype.getCost = function (coords) {
        var _this = this;
        if (!coords.from.latitude)
            return;
        var self = this;
        self.clear();
        var body = {
            "adds": ["simple_bagage", "pay_parking"],
            "bookingTime": "20",
            "class": "Com",
            "destinations": [
                {
                    "kind": "street",
                    "lat": coords.from.latitude,
                    "lon": coords.from.longitude
                }
            ],
            "source": {
                "kind": "district",
                "lat": coords.to.latitude ? coords.to.latitude : coords.from.latitude,
                "lon": coords.to.longitude ? coords.to.longitude : coords.from.longitude
            },
            "taxi": "taxity"
        };
        return new Promise(function (resolve, reject) {
            _this.http.post(config_1.URL + "/Order/Cost", body)
                .subscribe(function (res) {
                var data = res.json();
                self.cost = coords.to.longitude === 0 ? Math.ceil(data.min) : Math.ceil(data.sum);
                self.emitUpdate();
                resolve(data);
            }, function (err) {
                self.cost = "---";
                self.emitUpdate();
                reject(err);
            });
        });
    };
    Cost.prototype.clear = function () {
        this.cost = null;
        this.emitUpdate();
    };
    Cost.prototype.emitUpdate = function () {
        this.costSource.next(this.cost);
    };
    Cost = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, place_1.Place])
    ], Cost);
    return Cost;
})();
exports.Cost = Cost;
