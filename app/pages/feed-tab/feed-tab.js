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
var history_1 = require('./../../providers/order/history');
var FeedTabPage = (function () {
    function FeedTabPage(OrderHistoryProvider) {
        this.OrderHistoryProvider = OrderHistoryProvider;
        this.address = true;
        this.header = {
            address: 'Избранные адреса',
            trip: 'Избранные поездки'
        };
        this.addresses = [
            { title: "Дом", data: { street: 'Комсомольская 69, п.1' } },
            { title: "Моя работа", data: { street: 'Петрозаводская 45' } },
            { title: "Работа жены", data: { street: 'Комсомольская 69, п.1' } },
            { title: "Детский сад", data: { street: 'Петрозаводская 45' } }
        ];
        this.trips = this.OrderHistoryProvider.get();
    }
    FeedTabPage.prototype.toggleView = function () {
        this.address = !this.address;
    };
    FeedTabPage = __decorate([
        core_1.Component({
            selector: 'feed-tab-page',
            templateUrl: 'build/pages/feed-tab/feed-tab.html',
        }), 
        __metadata('design:paramtypes', [history_1.OrderHistory])
    ], FeedTabPage);
    return FeedTabPage;
})();
exports.FeedTabPage = FeedTabPage;
