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
var ionic_native_1 = require('ionic-native');
var home_1 = require('./pages/home/home');
var settings_1 = require('./pages/settings/settings');
var time_1 = require('./pages/time/time');
var account_1 = require('./pages/account/account');
var place_1 = require('./providers/place/place');
var ride_1 = require("./providers/ride/ride");
var cost_1 = require("./providers/cost/cost");
var address_panel_1 = require('./components/address_panel');
var main_1 = require("./pages/main/main");
var nav_1 = require("./providers/nav/nav");
var registration_1 = require("./components/registration/registration");
var auth_1 = require("./providers/auth/auth");
var car_options_1 = require("./providers/car-options/car-options");
var gather_order_1 = require("./providers/order/gather_order");
var address_1 = require("./providers/address/address");
var history_1 = require('./providers/order/history');
var map_1 = require('./providers/map/map');
var MainTabs = (function () {
    function MainTabs(nav, AuthProvider, NavProvider) {
        //document.addEventListener("deviceready", () => {
        //    cordova.plugins.Keyboard.disableScroll(true);
        //});
        this.nav = nav;
        this.AuthProvider = AuthProvider;
        this.NavProvider = NavProvider;
        this.home = home_1.HomePage;
        this.settings = settings_1.SettingsPage;
        this.time = time_1.TimePage;
        this.account = account_1.AccountPage;
    }
    MainTabs = __decorate([
        core_1.Component({
            selector: 'main-tabs',
            template: "\n    <ion-tabs>\n      <ion-tab tabIcon=\"locate\" [root]=\"home\"></ion-tab>\n      <ion-tab tabIcon=\"options\" [root]=\"settings\"></ion-tab>\n      <ion-tab tabIcon=\"clock\" [root]=\"time\"></ion-tab>\n      <ion-tab tabIcon=\"person\" [root]=\"account\"></ion-tab>\n    </ion-tabs>"
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController, auth_1.Auth, nav_1.Nav])
    ], MainTabs);
    return MainTabs;
})();
exports.MainTabs = MainTabs;
var App = (function () {
    function App(platform, place, NavProvider, AuthProvider) {
        this.platform = platform;
        this.place = place;
        this.NavProvider = NavProvider;
        this.AuthProvider = AuthProvider;
        this.rootPage = main_1.MainPage;
        this.platform.ready().then(function () {
            ionic_native_1.StatusBar.styleDefault();
        });
        // let nav = this.app.getComponent('nav');
    }
    __decorate([
        core_1.ViewChild('myNav'), 
        __metadata('design:type', Object)
    ], App.prototype, "nav", void 0);
    App = __decorate([
        core_1.Component({
            template: '<ion-nav #myNav [root]="rootPage"></ion-nav>',
            providers: [place_1.Place, cost_1.Cost, nav_1.Nav, auth_1.Auth, address_1.AddressProvider, car_options_1.CarOptions, gather_order_1.GatherOrder, history_1.OrderHistory, map_1.MapProvider],
            directives: [main_1.MainPage, registration_1.RegistrationModal]
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.Platform, place_1.Place, nav_1.Nav, auth_1.Auth])
    ], App);
    return App;
})();
exports.App = App;
//
//const routes: RouterConfig = [
//  { path: '', pathMatch: 'full', redirectTo: '/home'},
//  { path: 'home', component: MyApp },
//  { path: 'search', component: SearchPage }
//];
//noinspection TypeScriptValidateTypes
ionic_angular_1.ionicBootstrap(App, [
    // Place,
    ride_1.RideProvider,
    core_1.provide(core_1.PLATFORM_DIRECTIVES, { useValue: [address_panel_1.Address], multi: true }),
], {
    tabbarPlacement: 'top',
    platforms: {
        ios: {
            tabbarPlacement: 'top'
        }
    }
});
