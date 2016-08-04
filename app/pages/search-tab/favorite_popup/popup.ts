import { Component } from '@angular/core';
import {  NavController } from 'ionic-angular';
import {  Place } from './../../../providers/place/place';
import {Subject, BehaviorSubject, Observable} from 'rxjs';
import {AddressProvider} from "./../../../providers/address/address";
import {AddressItem} from "./../../../interfaces/address";

@Component({
    templateUrl: 'build/pages/search-tab/favorite_popup/popup.html'
})
export class FavoritePopup {

    name: string;
    address: AddressItem;

    constructor(private nav: NavController, public addressProvider: AddressProvider) {
         addressProvider.addressFavorite$.subscribe(newAddress => {
            this.address = newAddress;
        });
    }

    addAddress(){
        this.addressProvider.save(this.name, this.address);
    }

}