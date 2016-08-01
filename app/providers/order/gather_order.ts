import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { OrderModel } from './../../models/order';


@Injectable()
export class GatherOrder {
    data:any;
    destinations:Array<Object>;//type KnopkaGeoPoint[]
    source:Object;//type KnopkaGeoPoint
    urgent:boolean = false;
    requirements:Array<string>;
    phone:string;
    /*
     string CashlessClientPass
       PaymentType[] AvailablePaymentTypes
       int Bookmins
       string Booktype
       KnopkaGeoPoint[] Destinations
       string RecipientBlackListed
       string RecipientLoyal
       string RecipientPhone
       String[] Requirements
       KnopkaGeoPoint Source
       bool Urgent
       CarClass VehicleClass
     */

    constructor(private http:Http) {


    }

    public setDestination(data: Object) {
        this.destinations = [data];
    }
    public setSource(point: Object) {
        this.destinations = [point];
    }
    public setUrgent(point: Object) {
        this.destinations = [point];
    }
    public setRequirements(data: Array<string>) {
        this.requirements = data;
    }
    public setPhone(data: string) {
        this.phone = data;
    }

    public get() {
        return this;
    }

    clear() {
        this.destinations = [];
    }
}

