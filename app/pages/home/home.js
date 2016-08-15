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
var map_1 = require('./../../components/map');
var place_1 = require('./../../providers/place/place');
var cost_1 = require('./../../providers/cost/cost');
var index_1 = require("ionic-angular/index");
// import polyline from 'polyline'
var HomePage = (function () {
    function HomePage(Place, nav, CostProvider) {
        this.Place = Place;
        this.nav = nav;
        this.CostProvider = CostProvider;
        var self = this;
        this.nav = nav;
        this.status = {
            from: 'определение адреса подачи такси',
            to: 'определение адреса поездки',
        };
        //this.makeRequest();
        this.isAddress = false;
        CostProvider.cost$.subscribe(function (cost) {
            self.cost = cost;
        });
    }
    HomePage.prototype.ngOnInit = function () {
        this.callEnable = this.enableCall.bind(this);
    };
    HomePage.prototype.enableCall = function (value) {
        this.isAddress = value;
    };
    HomePage.prototype.makeRequest = function () {
        var _this = this;
        this.Place.getPosition().then(function (coords) {
            _this.Place.getCurrentAddress(coords);
        }).catch(function (err) {
            console.log(err);
        });
    };
    HomePage.prototype.onDragendMap = function (coords) {
        this.Place.getCurrentAddress({
            latitude: coords.lat,
            longitude: coords.lng
        });
    };
    HomePage = __decorate([
        core_1.Component({
            selector: 'home-page',
            templateUrl: 'build/pages/home/home.html',
            directives: [map_1.Map],
        }), 
        __metadata('design:paramtypes', [place_1.Place, index_1.NavController, cost_1.Cost])
    ], HomePage);
    return HomePage;
})();
exports.HomePage = HomePage;
