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
require('rxjs/add/operator/map');
var rxjs_1 = require('rxjs');
var MapProvider = (function () {
    function MapProvider() {
        this.stateSource = new rxjs_1.BehaviorSubject({
            initial: true,
            searching: false,
            clicked: false,
            direction: 'from'
        });
        this.state$ = this.stateSource.asObservable();
        this.state = this.stateSource.value;
    }
    MapProvider.prototype.set = function (name, value) {
        this.state[name] = value;
        this.update();
    };
    MapProvider.prototype.getState = function () {
        return this.state;
    };
    MapProvider.prototype.update = function () {
        this.stateSource.next(this.state);
        console.log('new mapprovider', this.state);
    };
    MapProvider = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], MapProvider);
    return MapProvider;
})();
exports.MapProvider = MapProvider;
