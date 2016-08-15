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
var address_panel_1 = require('./../../components/address_panel');
var loader_1 = require('./../../components/loader/loader');
var gather_order_1 = require('./../../providers/order/gather_order');
var car_options_1 = require("../../providers/car-options/car-options");
/*
  Generated class for the SettingsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var SettingsPage = (function () {
    function SettingsPage(GatherOrderProvider, nav, CarOptionsProvider) {
        var _this = this;
        this.GatherOrderProvider = GatherOrderProvider;
        this.nav = nav;
        this.CarOptionsProvider = CarOptionsProvider;
        this.serviceInput = [];
        this.nav = nav;
        this.tariffs = [
            { name: 'Эконом', price: '50 руб' },
            { name: 'Комфорт', price: '100 руб' },
            { name: 'Бизнесс', price: '200 руб' }
        ];
        this.payment = ['Наличными', 'Безналичными', 'Баллами'];
        //this.service = [
        //  {name: 'Перевозки животных', comment: ''},
        //  {name: 'Детское кресло', comment: '3 года'},
        //  {name: 'Водитель не курит', comment: ''},
        //  {name: 'Кондиционер', comment: ''},
        //  {name: 'Универсал', comment: ''},
        //  {name: 'Купон', comment: ''},
        //  {name: 'WI-FI', comment: ''}
        //];
        CarOptionsProvider.requirements$.subscribe(function (req) {
            _this.service = req;
        });
        CarOptionsProvider.carClasses$.subscribe(function (cars) {
            _this.tariffs = cars;
            _this.changeTariff(_this.tariffs[0]);
        });
        this.changePayment(this.payment[0]);
    }
    ;
    SettingsPage.prototype.getId = function (name, id) {
        return name + id;
    };
    SettingsPage.prototype.showLoader = function () {
        this.nav.push(loader_1.Loader);
    };
    SettingsPage.prototype.changeTariff = function (data) {
        this.tariffInput = data['value'];
        this.GatherOrderProvider.setVehicleClass(this.tariffInput);
    };
    SettingsPage.prototype.changePayment = function (data) {
        this.paymentInput = this.paymentInput === data ? '' : data;
    };
    SettingsPage.prototype.changeService = function (data) {
        var filtered = this.serviceInput.filter(function (item) { return data === item; });
        if (filtered.length) {
            this.serviceInput = this.serviceInput.filter(function (item) { return data !== item; });
        }
        else {
            this.serviceInput.push(data);
        }
        this.GatherOrderProvider.setRequirements(this.serviceInput);
    };
    SettingsPage.prototype.isCheckedService = function (data) {
        return this.serviceInput.filter(function (item) { return data === item; }).length > 0;
    };
    SettingsPage.prototype.func = function () {
        console.log(this.tariffInput);
        console.log(this.paymentInput);
        console.log(this.serviceInput);
    };
    SettingsPage = __decorate([
        core_1.Component({
            selector: 'settings-page',
            templateUrl: 'build/pages/settings/settings.html',
            directives: [address_panel_1.Address]
        }), 
        __metadata('design:paramtypes', [gather_order_1.GatherOrder, ionic_angular_1.NavController, car_options_1.CarOptions])
    ], SettingsPage);
    return SettingsPage;
})();
exports.SettingsPage = SettingsPage;
