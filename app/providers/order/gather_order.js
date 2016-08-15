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
var http_1 = require('@angular/http');
var auth_1 = require("../auth/auth");
var place_1 = require("../place/place");
var car_options_1 = require("../car-options/car-options");
var config_1 = require('./../../config');
var GatherOrder = (function () {
    function GatherOrder(http, AuthProvider, PlaceProvider, CarOptionsProvider) {
        this.http = http;
        this.AuthProvider = AuthProvider;
        this.PlaceProvider = PlaceProvider;
        this.CarOptionsProvider = CarOptionsProvider;
        this.urgent = false;
    }
    GatherOrder.prototype.setDestination = function (data) {
        this.destinations = [data];
    };
    GatherOrder.prototype.setSource = function (point) {
        this.source = point;
    };
    GatherOrder.prototype.setUrgent = function (point) {
        this.urgent = point;
    };
    GatherOrder.prototype.setRequirements = function (data) {
        this.requirements = data;
    };
    GatherOrder.prototype.setPhone = function (data) {
        this.recipientPhone = data;
    };
    GatherOrder.prototype.setVehicleClass = function (data) {
        this.vehicleClass = data;
    };
    GatherOrder.prototype.setRecipientBlackListed = function (data) {
        this.recipientBlackListed = data;
    };
    GatherOrder.prototype.setRecipientLoyal = function (data) {
        this.recipientLoyal = data;
    };
    GatherOrder.prototype.get = function () {
        return this;
    };
    GatherOrder.prototype.setAddress = function (type, address) {
        var item = {
            city: address.city,
            closestStation: '',
            country: address.country,
            description: '',
            entrance: '',
            fullAddress: address.fullAddress,
            housing: address.housing,
            index: 1,
            kind: 'street',
            lat: address.geoPoint.lat,
            lon: address.geoPoint.lon,
            shortAddress: address.shortAddress
        };
        if (type === 'source') {
            this.source = item;
        }
        else if (type === 'destination') {
            this.destinations = [item];
        }
    };
    GatherOrder.prototype.createOrder = function () {
        var _this = this;
        var user = this.AuthProvider.getUser();
        var source = this.PlaceProvider.getFullAddress('from');
        var destination = this.PlaceProvider.getFullAddress('to');
        /**
         * TODO Собрать заказ в нужном формате
         * @type {{}}
         * {
            "apiId" : "14d0e38a-3126-4822-adba-c4b922efe821",
            "order" :
            {
                "bookingDate" : "27-05-2016 09:15",
                "bookmins" : 20,
                "booktype" : "exact",
                "destinations" : [
                    {
                        "city" : "Севастополь",
                        "closestStation" : "",
                        "country" : "Россия",
                        "fullAddress" : "Севастополь, аллея Астапова",
                        "index" : 1,
                        "kind" : "street",
                        "lat" : 44.562354,
                        "lon" : 33.455128,
                        "shortAddress" : "аллея Астапова",
                        "street" : "аллея Астапова"

                     }
                ],
                "recipientBlackListed" : "no",
                "recipientLoyal" : "yes",
                "recipientPhone" : "+79055337245",
                "requirements" : ["simple_bagage", "pay_parking"],
                "source" :
                {
                    "city" : "Севастополь",
                    "closestStation" : "",
                    "country" : "Россия",
                    "description" : "sfd",
                    "entrance" : "sdf",
                    "fullAddress" : "Севастополь, dsf, п. sdf",
                    "housing" : "dsf",
                    "index" : 0,
                    "kind" : "district",
                    "lat" : 44.565212,
                    "lon" : 33.46417,
                    "shortAddress" : "dsf, п. sdf"
                },
                "urgent" : false,
                "vehicleClass" : "Com"
            }
         }
         */
        this.apiId = user.id;
        this.order = {
            bookingDate: "27-05-2016 09:15",
            bookmins: 20,
            booktype: "exact",
            destinations: [destination],
            recipientBlackListed: "no",
            recipientLoyal: "yes",
            recipientPhone: user.phone,
            requirements: this.requirements,
            source: source,
            urgent: this.urgent,
            vehicleClass: this.vehicleClass
        };
        var body = {
            apiId: user.id,
            order: this.order
        };
        console.log(JSON.stringify(body));
        return new Promise(function (resolve, reject) {
            _this.http.post(config_1.URL + "/Order/Create", body)
                .subscribe(function (res) {
                var data = res.json();
                _this.currentOrderId = data.orderId;
                resolve(data);
            }, function (err) {
                reject(err);
            });
        });
    };
    GatherOrder.prototype.cancelOrder = function () {
        //let user = this.AuthProvider.getUser();
        var _this = this;
        var body = {
            orderId: this.currentOrderId,
            apiId: this.apiId,
            reason: ''
        };
        return new Promise(function (resolve, reject) {
            _this.http.post(config_1.URL + "/Order/Cancel", body)
                .subscribe(function (res) {
                var data = res.json();
                _this.currentOrderId = data.orderId;
                resolve(data);
            }, function (err) {
                reject(err);
            });
        });
    };
    GatherOrder.prototype.getOrderStatus = function () {
        var _this = this;
        var user = this.AuthProvider.getUser();
        var body = {
            orderId: this.currentOrderId,
            apiId: user.apiId /*,
            lastDate: this.lastDate*/
        };
        return new Promise(function (resolve, reject) {
            _this.http.post(config_1.URL + "/Order/Status", body)
                .subscribe(function (res) {
                var data = res.json();
                _this.currentOrderId = data.orderId;
                resolve({ order: _this.order, response: data });
            }, function (err) {
                reject(err);
            });
        });
    };
    GatherOrder.prototype.clear = function () {
        this.destinations = [];
    };
    GatherOrder.prototype.updateLastDate = function () {
        /**
         * TODO получать текущую дату и время в формате 2016-05-27 13:18:21.0
         * @type {string}
         */
        var date = '';
        this.lastDate = date;
    };
    GatherOrder = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, auth_1.Auth, place_1.Place, car_options_1.CarOptions])
    ], GatherOrder);
    return GatherOrder;
})();
exports.GatherOrder = GatherOrder;
