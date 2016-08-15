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
var config_1 = require('./../../config');
var Rx_1 = require("rxjs/Rx");
var Auth = (function () {
    function Auth(http) {
        this.userSource = new Rx_1.BehaviorSubject({});
        // Observable data streams
        this.user$ = this.userSource.asObservable();
        this.http = http;
        this.user = {
            id: null,
            name: null,
            phone: null
        };
        var user = localStorage.getItem('user');
        if (user) {
            this.user = JSON.parse(user);
            this.emitUpdate();
        }
    }
    Auth.prototype.register = function (name, number) {
        var _this = this;
        var body = {
            name: name,
            phone: number,
            taxi: 'taxity',
            confirm: true
        };
        this.user['name'] = name;
        this.user['phone'] = number;
        this.emitUpdate();
        localStorage.setItem('user', JSON.stringify(this.user));
        return new Promise(function (resolve, reject) {
            _this.http.post(config_1.URL + "/Register/Register", JSON.stringify(body))
                .subscribe(function (res) {
                var data = res.json();
                resolve(data);
            }, function (err) {
                reject(err);
            });
        });
    };
    Auth.prototype.confirm = function (key, number) {
        var _this = this;
        var body = {
            key: key,
            phone: number
        };
        var self = this;
        return new Promise(function (resolve, reject) {
            _this.http.post(config_1.URL + "/Register/Confirm", JSON.stringify(body))
                .subscribe(function (res) {
                var data = res.json();
                self.user['id'] = data.apiId;
                _this.emitUpdate();
                localStorage.setItem('user', JSON.stringify(_this.user));
                resolve();
            }, function (err) {
                reject(err);
            });
        });
    };
    Auth.prototype.check = function () {
        var data = localStorage.getItem('user');
        if (data) {
            var user = JSON.parse(data);
        }
        else {
            return false;
        }
        return !!user.id;
    };
    Auth.prototype.getUser = function () {
        return this.user;
    };
    Auth.prototype.emitUpdate = function () {
        this.userSource.next(this.user);
    };
    Auth = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], Auth);
    return Auth;
})();
exports.Auth = Auth;
