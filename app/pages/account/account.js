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
var ionic_angular_1 = require('ionic-angular');
var rides_1 = require("./modal/rides");
var auth_1 = require("../../providers/auth/auth");
var history_1 = require("../../providers/order/history");
var AccountPage = (function () {
    function AccountPage(nav, AuthProvider, OrderHistoryProvider) {
        var _this = this;
        this.nav = nav;
        this.AuthProvider = AuthProvider;
        this.OrderHistoryProvider = OrderHistoryProvider;
        this.nav = nav;
        this.user = {
            name: null,
            id: null,
            phone: null
        };
        this.lastRidesLenth = this.OrderHistoryProvider.get().length || 0;
        AuthProvider.user$.subscribe(function (user) {
            _this.user = user;
        });
    }
    AccountPage.prototype.showRidesModal = function () {
        this.nav.push(rides_1.RidesModal);
    };
    AccountPage = __decorate([
        core_1.Component({
            selector: 'account-page',
            templateUrl: 'build/pages/account/account.html',
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController, auth_1.Auth, history_1.OrderHistory])
    ], AccountPage);
    return AccountPage;
})();
exports.AccountPage = AccountPage;
