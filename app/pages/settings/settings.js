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
var place_1 = require('./../../providers/place/place');
/*
  Generated class for the SettingsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var SettingsPage = (function () {
    function SettingsPage(nav) {
        this.nav = nav;
        this.nav = nav;
        this.tariffs = [
            { name: 'Эконом', price: '50 руб' },
            { name: 'Комфорт', price: '100 руб' },
            { name: 'Бизнесс', price: '200 руб' }
        ];
        this.payment = ['Наличными', 'Безналичными', 'Баллами'];
        this.service = [
            { name: 'Перевозки животных', comment: '' },
            { name: 'Детское кресло', comment: '3 года' },
            { name: 'Водитель не курит', comment: '' },
            { name: 'Кондиционер', comment: '' },
            { name: 'Универсал', comment: '' },
            { name: 'Купон', comment: '' },
            { name: 'WI-FI', comment: '' }
        ];
    }
    SettingsPage.prototype.getId = function (name, id) {
        return name + id;
    };
    SettingsPage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/settings/settings.html',
            directives: [address_panel_1.Address],
            providers: [place_1.Place]
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController])
    ], SettingsPage);
    return SettingsPage;
})();
exports.SettingsPage = SettingsPage;
