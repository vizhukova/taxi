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
var Rx_1 = require("rxjs/Rx");
/*
 Generated class for the Nav provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
var Nav = (function () {
    function Nav() {
        this.tabSource = new Rx_1.Subject(null);
        this.tabSetSource = new Rx_1.Subject(null);
        this.tab$ = this.tabSource.asObservable();
        this.tabSet$ = this.tabSetSource.asObservable();
        this.tab = 'home';
        this.tabSet = 'main';
    }
    Nav.prototype.changeTab = function (tab) {
        this.tab = tab;
        this.tabSource.next(tab);
    };
    Nav.prototype.changeTabSet = function (tabSet) {
        this.tab = 'home';
        this.tabSet = tabSet;
        this.tabSetSource.next(tabSet);
        this.tabSource.next(this.tab);
    };
    Nav.prototype.getCurrentTab = function () {
        return this.tab;
    };
    Nav.prototype.getCurrentTabSet = function () {
        return this.tabSet;
    };
    Nav = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], Nav);
    return Nav;
})();
exports.Nav = Nav;
