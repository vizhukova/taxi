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
/*
  Generated class for the TimeTabPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var TimeTabPage = (function () {
    function TimeTabPage() {
        this.address = true;
        this.header = 'Прошлые поездки';
        this.addresses = [
            { title: "Дом", data: { street: 'Комсомольская 69, п.1' } },
            { title: "Моя работа", data: { street: 'Петрозаводская 45' } },
            { title: "Работа жены", data: { street: 'Комсомольская 69, п.1' } },
            { title: "Детский сад", data: { street: 'Петрозаводская 45' } }
        ];
        this.trips = [
            { title: "Дом", data: { from: 'Комсомольская 69, п.1', to: 'Большая Серпуховская, 64' } },
            { title: "Моя работа", data: { from: 'Петрозаводская 45', to: 'Большая Серпуховская, 64' } },
            { title: "Работа жены", data: { from: 'Комсомольская 69, п.1', to: 'Большая Серпуховская, 64' } },
            { title: "Детский сад", data: { from: 'Петрозаводская 45', to: 'Большая Серпуховская, 64' } }
        ];
    }
    TimeTabPage.prototype.toggleView = function () {
        this.address = !this.address;
    };
    TimeTabPage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/time-tab/time-tab.html',
        }), 
        __metadata('design:paramtypes', [])
    ], TimeTabPage);
    return TimeTabPage;
})();
exports.TimeTabPage = TimeTabPage;
