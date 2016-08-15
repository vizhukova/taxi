import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Ride } from './../../models/ride';
import {Subject, BehaviorSubject, Observable} from 'rxjs'
import {AddressItem} from "./../../interfaces/address";

@Injectable()
export class AddressProvider {

     private addressFavoriteSource = new BehaviorSubject<any>({});
    
     addressFavorite$ = this.addressFavoriteSource.asObservable();

    constructor() {

    }

     public changeFavoriteAddress(address:AddressItem) {
        this.addressFavoriteSource.next(address);
    }

    public getFavoriteAddresses() {
        let data = localStorage.getItem('favorite_address') ? JSON.parse(localStorage.getItem('favorite_address')) : {};
        return data;
    }

    public save(key: string, data: AddressItem) {

        let dataToSave = this.getFavoriteAddresses();
        dataToSave[key] = data;
        localStorage.setItem('favorite_address', JSON.stringify(dataToSave));
    }

    public saveObject(data: Object) {

        localStorage.setItem('favorite_address', JSON.stringify(data));
    }




}
