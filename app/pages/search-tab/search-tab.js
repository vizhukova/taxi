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
var map_1 = require('./../../components/map');
var index_1 = require("ionic-angular/index");
var popup_1 = require("./favorite_popup/popup");
var SearchTabPage = (function () {
    function SearchTabPage(nav) {
        this.nav = nav;
        this.nav = nav;
    }
    SearchTabPage.prototype.showRidesModal = function () {
        this.nav.push(popup_1.FavoritePopup);
    };
    SearchTabPage = __decorate([
        core_1.Component({
            selector: 'search-tab-page',
            templateUrl: 'build/pages/search-tab/search-tab.html',
            directives: [map_1.Map]
        }), 
        __metadata('design:paramtypes', [index_1.NavController])
    ], SearchTabPage);
    return SearchTabPage;
})();
exports.SearchTabPage = SearchTabPage;
