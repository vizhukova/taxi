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

    public save(key: string, data: AddressItem) {
        let dataToSave = JSON.stringify(data);
        localStorage.setItem(key, dataToSave);
    }



}
