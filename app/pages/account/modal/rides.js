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
var ride_1 = require('./../../../providers/ride/ride');
var history_1 = require('./../../../providers/order/history');
var RidesModal = (function () {
    function RidesModal(nav, RideProvider, OrderHistoryProvider) {
        this.nav = nav;
        this.RideProvider = RideProvider;
        this.OrderHistoryProvider = OrderHistoryProvider;
        this.tab = "future";
        this.nav = nav;
        this.tabDats = {
            future: 'Поездки будущие',
            last: 'Поездки прошлые'
        };
        this.futureRides = [];
        //this.lastRides = [
        //    new Ride('15 февраля, 22:05', {street: 'Комсомольская 69, п.1'}, {street: 'Большая Серпуховская, 64'}),
        //    new Ride('15 февраля, 22:05', {street: 'Комсомольская 69, п.1'}, {street: 'Большая Серпуховская, 64'}),
        //    new Ride('15 февраля, 22:05', {street: 'Комсомольская 69, п.1'}, {street: 'Большая Серпуховская, 64'}),
        //    new Ride('15 февраля, 22:05', {street: 'Комсомольская 69, п.1'}, {street: 'Большая Серпуховская, 64'})
        //];
        this.lastRides = this.OrderHistoryProvider.get();
        console.log(this.lastRides);
        //RideProvider.save('rides', this.lastRides);
        //let a = RideProvider.get('rides');
        //console.log(a);
    }
    RidesModal.prototype.tabClick = function (value) {
        this.tab = value;
    };
    RidesModal.prototype.getArrayOfRides = function () {
        return this.tab === 'future' ? this.futureRides : this.lastRides;
    };
    RidesModal = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/account/modal/rides.html',
            providers: [ride_1.RideProvider]
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController, ride_1.RideProvider, history_1.OrderHistory])
    ], RidesModal);
    return RidesModal;
})();
exports.RidesModal = RidesModal;
