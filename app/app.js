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
var ride_1 = require("./providers/ride");
var address_panel_1 = require('./components/address_panel');
var MyApp = (function () {
    function MyApp(platform) {
        this.home = home_1.HomePage;
        this.settings = settings_1.SettingsPage;
        this.time = time_1.TimePage;
        this.account = account_1.AccountPage;
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            ionic_native_1.StatusBar.styleDefault();
        });
    }
    MyApp = __decorate([
        core_1.Component({
            template: "\n    <ion-tabs>\n      <ion-tab tabIcon=\"locate\" [root]=\"home\"></ion-tab>\n      <ion-tab tabIcon=\"options\" [root]=\"settings\"></ion-tab>\n      <ion-tab tabIcon=\"clock\" [root]=\"time\"></ion-tab>\n      <ion-tab tabIcon=\"person\" [root]=\"account\"></ion-tab>\n    </ion-tabs>\n" }), 
        __metadata('design:paramtypes', [ionic_angular_1.Platform])
    ], MyApp);
    return MyApp;
})();
exports.MyApp = MyApp;
//
//const routes: RouterConfig = [
//  { path: '', pathMatch: 'full', redirectTo: '/home'},
//  { path: 'home', component: MyApp },
//  { path: 'search', component: SearchPage }
//];
//noinspection TypeScriptValidateTypes
ionic_angular_1.ionicBootstrap(MyApp, [
    place_1.Place,
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
