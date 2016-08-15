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
var account_1 = require('../../pages/account/account');
var home_1 = require('../../pages/home/home');
var settings_1 = require('../../pages/settings/settings');
var time_1 = require('../../pages/time/time');
var search_tab_1 = require('../../pages/search-tab/search-tab');
var time_tab_1 = require('../../pages/time-tab/time-tab');
var feed_tab_1 = require('../../pages/feed-tab/feed-tab');
var fly_tab_1 = require('../../pages/fly-tab/fly-tab');
var ionic_angular_1 = require('ionic-angular');
var nav_1 = require("../../providers/nav/nav");
var registration_1 = require("../../components/registration/registration");
var auth_1 = require("../../providers/auth/auth");
var place_1 = require("../../providers/place/place");
var cost_1 = require("../../providers/cost/cost");
var loader_1 = require("../../components/loader/loader");
var car_options_1 = require("../../providers/car-options/car-options");
var gather_order_1 = require("../../providers/order/gather_order");
var map_1 = require("../../providers/map/map");
var MainPage = (function () {
    function MainPage(nav, NavProvider, MapProvider, AuthProvider, PlaceProvider, CostProvider, CarOptionsProvider, GatherOrderProvider) {
        var _this = this;
        this.nav = nav;
        this.NavProvider = NavProvider;
        this.MapProvider = MapProvider;
        this.AuthProvider = AuthProvider;
        this.PlaceProvider = PlaceProvider;
        this.CostProvider = CostProvider;
        this.CarOptionsProvider = CarOptionsProvider;
        this.GatherOrderProvider = GatherOrderProvider;
        this.nav = nav;
        this.activeTab = 'home';
        this.activeTabSet = 'main';
        this.status = {
            from: 'определение адреса подачи такси',
            to: 'определение адреса поездки',
        };
        setTimeout(function () {
            if (cordova && cordova.plugins && cordova.plugins.locationAccuracy) {
                if (cordova) {
                    cordova.plugins.locationAccuracy.canRequest(function (canRequest) {
                        if (canRequest) {
                            cordova.plugins.locationAccuracy.request(function () {
                                console.log("Successfully made request to invoke native Location Services dialog");
                            }, function () {
                                console.error("Failed to invoke native Location Services dialog");
                            });
                        }
                    });
                }
            }
        }, 300);
        NavProvider.tab$.subscribe(function (tab) {
            _this.activeTab = tab;
        });
        MapProvider.state$.subscribe(function (newState) {
            _this.state = newState;
        });
        NavProvider.tabSet$.subscribe(function (tabSet) {
            _this.activeTabSet = tabSet;
        });
        PlaceProvider.path$.subscribe(function (status) {
            _this.pathStatus = status;
        });
        CostProvider.cost$.subscribe(function (cost) {
            _this.cost = cost;
        });
        CarOptionsProvider.load();
    }
    MainPage.prototype.changeTab = function (newTab) {
        this.activeTab = newTab;
    };
    MainPage.prototype.setClasses = function (active) {
        return {
            tab: true,
            active: this.activeTab === active
        };
    };
    MainPage.prototype.setCallClasses = function () {
        return {
            call: true,
            active: !this.state.searching
        };
    };
    MainPage.prototype.ngAfterViewInit = function () {
        if (!this.AuthProvider.check()) {
            this.nav.push(registration_1.RegistrationModal);
        }
        this.PlaceProvider.changePathStatus(false);
    };
    MainPage.prototype.makeOrder = function () {
        var _this = this;
        if (!this.AuthProvider.check()) {
            this.nav.push(registration_1.RegistrationModal);
        }
        else {
            this.GatherOrderProvider.createOrder().then(function () {
                _this.nav.push(loader_1.Loader);
            }).catch(function (err) {
                console.log(err.stack);
            });
        }
    };
    MainPage = __decorate([
        core_1.Component({
            selector: 'search-page',
            templateUrl: 'build/pages/main/main.html',
            directives: [
                settings_1.SettingsPage,
                home_1.HomePage,
                account_1.AccountPage,
                time_1.TimePage,
                search_tab_1.SearchTabPage,
                time_tab_1.TimeTabPage,
                feed_tab_1.FeedTabPage,
                fly_tab_1.FlyTabPage
            ]
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController, nav_1.Nav, map_1.MapProvider, auth_1.Auth, place_1.Place, cost_1.Cost, car_options_1.CarOptions, gather_order_1.GatherOrder])
    ], MainPage);
    return MainPage;
})();
exports.MainPage = MainPage;
