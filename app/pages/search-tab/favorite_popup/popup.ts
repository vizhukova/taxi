import { Component } from '@angular/core';
import {  NavController } from 'ionic-angular';
import {  Place } from './../../../providers/place/place';

@Component({
    templateUrl: 'build/pages/search-tab/favorite_popup/popup.html'
})
export class FavoritePopup {



    constructor(private nav: NavController, private Place: Place) {

    }

}