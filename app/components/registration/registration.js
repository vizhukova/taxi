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
var auth_1 = require('./../../providers/auth/auth');
var place_1 = require('./../../providers/place/place');
var map_1 = require('./../../providers/map/map');
var RegistrationModal = (function () {
    function RegistrationModal(nav, AuthProvider, PlaceProvider, MapProvider) {
        this.nav = nav;
        this.AuthProvider = AuthProvider;
        this.PlaceProvider = PlaceProvider;
        this.MapProvider = MapProvider;
        this.isCode = false;
        this.isShownInput = false;
        this.powers = ['Really Smart', 'Super Flexible',
            'Super Hot', 'Weather Changer'];
        //cordova.plugins.Keyboard.disableScroll(true);
        this.MapProvider.set('authorized', false);
    }
    RegistrationModal.prototype.closeKeyboard = function (event) {
        if (cordova && cordova.plugins && cordova.plugins.Keyboard && event.target.tagName !== 'INPUT') {
            //window.scrollTo(document.body.scrollLeft, document.body.scrollTop);
            //window.scrollTo(0, 0);
            //setTimeout(cordova.plugins.Keyboard.close(), 500);
            cordova.plugins.Keyboard.close();
        }
        if (event.target.className !== 'input') {
            this.isShownInput = false;
        }
    };
    RegistrationModal.prototype.onPageWillEnter = function () {
        //hide nav bar when we enter the page
        // (<HTMLScriptElement[]><any>document.getElementsByTagName('ion-tabbar'))[0].style.display = "none";
    };
    //show nav bar when we leave the page
    RegistrationModal.prototype.onPageDidLeave = function () {
        // (<HTMLScriptElement[]><any>document.getElementsByTagName('ion-tabbar'))[0].style.display = "flex";
    };
    RegistrationModal.prototype.sentCode = function () {
        this.isCode = true;
        console.log(this);
        this.AuthProvider.register(this.name, this.code + this.number);
    };
    RegistrationModal.prototype.register = function () {
        var _this = this;
        if (this.isCode) {
            this.AuthProvider.confirm(this.key, this.code + this.number).then(function () {
                _this.nav.pop();
            });
        }
        else {
            this.nav.pop();
            this.PlaceProvider.reloadMap('homeMap');
        }
        this.MapProvider.set('authorized', true);
        this.PlaceProvider.changePathStatus(false);
    };
    RegistrationModal.prototype.showSelect = function (value) {
        this.isShownInput = value;
    };
    RegistrationModal.prototype.setCode = function (value) {
        this.code = value;
    };
    RegistrationModal.prototype.clearNumber = function () {
        this.number = '';
    };
    RegistrationModal = __decorate([
        core_1.Component({
            templateUrl: 'build/components/registration/registration.html',
            providers: [auth_1.Auth],
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController, auth_1.Auth, place_1.Place, map_1.MapProvider])
    ], RegistrationModal);
    return RegistrationModal;
})();
exports.RegistrationModal = RegistrationModal;
