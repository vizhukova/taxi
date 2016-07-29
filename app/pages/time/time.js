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
var place_1 = require('./../../providers/place/place');
/*
  Generated class for the TimePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var TimePage = (function () {
    function TimePage(nav) {
        this.nav = nav;
        this.nav = nav;
        this.time = [
            { name: 'Сейчас', comment: '~5-20 мин' },
            { name: 'Через', comment: '20 мин' },
            { name: 'Повторять', comment: '10:23' },
            { name: 'Другое', comment: 'чт, 7 июля 2016 10:23' }
        ];
    }
    TimePage.prototype.getId = function (name, id) {
        return name + id;
    };
    TimePage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/time/time.html',
            providers: [place_1.Place]
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController])
    ], TimePage);
    return TimePage;
})();
exports.TimePage = TimePage;
