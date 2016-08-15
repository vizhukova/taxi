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
var config_1 = require('./../../config');
var Rx_1 = require("rxjs/Rx");
var CarOptions = (function () {
    function CarOptions(http) {
        this.http = http;
        this.requirementsSource = new Rx_1.BehaviorSubject(null);
        this.carClassesSource = new Rx_1.BehaviorSubject(null);
        this.requirements$ = this.requirementsSource.asObservable();
        this.carClasses$ = this.carClassesSource.asObservable();
        this.options = null;
    }
    CarOptions.prototype.load = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.http.get(config_1.URL + "/Order/CarOptions")
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                _this.options = data;
                _this.requirements = CarOptions.parseRequirements(data);
                _this.carClasses = CarOptions.parseCarClasses(data);
                _this.emitUpdate();
                resolve(_this.options);
            });
        });
    };
    /**
     * TODO Сделать поиск по локали
     * @param data
     * @returns {{name: any, value: (number|string)}[]}
       */
    CarOptions.parseRequirements = function (data) {
        var source = data.requirements;
        return source.map((function (element) {
            return {
                name: element.name[0].value,
                value: element.code
            };
        }));
    };
    CarOptions.parseCarClasses = function (data) {
        var source = data.carClasses;
        return source.map((function (element) {
            return {
                name: element.name[0].value,
                value: element.value
            };
        }));
    };
    CarOptions.prototype.emitUpdate = function () {
        this.requirementsSource.next(this.requirements);
        this.carClassesSource.next(this.carClasses);
    };
    CarOptions = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], CarOptions);
    return CarOptions;
})();
exports.CarOptions = CarOptions;
