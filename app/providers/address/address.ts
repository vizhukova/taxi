import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Ride } from './../../models/ride';
import {Subject, BehaviorSubject, Observable} from 'rxjs'
import {AddressItem} from "./../../interfaces/address";

@Injectable()
export class AddressProvider {

     private addressFavoriteSource = new BehaviorSubject<AddressItem>({});
     private addressArrayFavoriteSource = new BehaviorSubject<Array<AddressItem>>([]);

     addressFavorite$ = this.addressFavoriteSource.asObservable();
     addressArrayFavorite$ = this.addressArrayFavoriteSource.asObservable();

    addressArray: Array<AddressItem>;
    address: AddressItem;

    constructor() {

    }

     public changeFavoriteAddress(address:AddressItem) {
         this.address = address;
        this.addressFavoriteSource.next(address);
    }

    public changeArrayFavoriteAddresses(addresses:Array<AddressItem>) {
         this.addressArray = addresses;
         this.addressArrayFavoriteSource.next(addresses);
    }

    public getFavoriteAddresses() {
        let data = localStorage.getItem('favorite_address') ? JSON.parse(localStorage.getItem('favorite_address')) : {};
        //this.changeArrayFavoriteAddresses(data);
        return data;
    }

    public save(key: string, data: AddressItem) {
        let dataToSave = this.getFavoriteAddresses();
        dataToSave[key] = data;
        this.changeArrayFavoriteAddresses(dataToSave);
        localStorage.setItem('favorite_address', JSON.stringify(dataToSave));
    }

    public saveObject(data: Array<AddressItem>) {
        localStorage.setItem('favorite_address', JSON.stringify(data));
        this.changeArrayFavoriteAddresses(data);
    }




}
