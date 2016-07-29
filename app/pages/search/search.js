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
var search_tab_1 = require('../../pages/search-tab/search-tab');
var time_tab_1 = require('../../pages/time-tab/time-tab');
var feed_tab_1 = require('../../pages/feed-tab/feed-tab');
var fly_tab_1 = require('../../pages/fly-tab/fly-tab');
var ionic_angular_1 = require('ionic-angular');
var SearchPage = (function () {
    function SearchPage(nav) {
        this.nav = nav;
        this.nav = nav;
        this.activeTab = 'search';
    }
    SearchPage.prototype.changeTab = function (newTab) {
        this.activeTab = newTab;
    };
    SearchPage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/search/search.html',
            directives: [search_tab_1.SearchTabPage, time_tab_1.TimeTabPage, feed_tab_1.FeedTabPage, fly_tab_1.FlyTabPage]
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController])
    ], SearchPage);
    return SearchPage;
})();
exports.SearchPage = SearchPage;
