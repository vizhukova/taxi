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
var gather_order_1 = require("../../providers/order/gather_order");
var history_1 = require("../../providers/order/history");
var Loader = (function () {
    function Loader(nav, GatherOrderProvider, OrderHistoryProvider) {
        var _this = this;
        this.nav = nav;
        this.GatherOrderProvider = GatherOrderProvider;
        this.OrderHistoryProvider = OrderHistoryProvider;
        this.intervalId = setInterval(function () {
            _this.GatherOrderProvider.getOrderStatus().then(function (data) {
                console.log('status: ', data['response']['status']);
                //условие, что заказ принят
                //this.close();
                _this.OrderHistoryProvider.save(data['order']);
            });
        }, 10000);
    }
    Loader.prototype.onPageWillEnter = function () {
        window.addEventListener('resize', this.onResize.bind(this));
        this.changeLoaderPositions();
    };
    Loader.prototype.onPageDidLeave = function () {
        window.removeEventListener('resize', this.onResize.bind(this));
    };
    Loader.prototype.onResize = function () {
        this.changeLoaderPositions();
    };
    Loader.prototype.changeLoaderPositions = function () {
        //get length and width of page
        var clientWidth = document.getElementsByTagName('body')[0].clientWidth;
        var clientHeight = document.getElementsByTagName('body')[0].clientHeight;
        //get first and second circles in loading page
        var elementFist = document.getElementById('first');
        var elementSecond = document.getElementById('second');
        //change circles`s position
        if (500 > clientWidth)
            (elementFist).style.left = "calc((" + clientWidth + "px - 500px)/2)";
        else
            (elementFist).style.left = "0px";
        if (500 > clientHeight)
            (elementFist).style.top = "calc((" + clientHeight + "px - 500px)/2)";
        else
            (elementFist).style.top = "0px";
        if (350 > clientWidth)
            (elementSecond).style.left = "calc((" + clientWidth + "px - 350px)/2)";
        else
            (elementSecond).style.left = "0px";
        if (350 > clientHeight)
            (elementSecond).style.top = "calc((" + clientHeight + "px - 350px)/2)";
        else
            (elementSecond).style.top = "0px";
    };
    Loader.prototype.calcelOrder = function () {
        this.GatherOrderProvider.cancelOrder();
        this.close();
    };
    Loader.prototype.close = function () {
        clearInterval(this.intervalId);
        this.nav.pop();
    };
    Loader = __decorate([
        core_1.Component({
            templateUrl: 'build/components/loader/loader.html',
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController, gather_order_1.GatherOrder, history_1.OrderHistory])
    ], Loader);
    return Loader;
})();
exports.Loader = Loader;
