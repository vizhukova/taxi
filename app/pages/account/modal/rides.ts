import { Component } from '@angular/core';
import {  NavController } from 'ionic-angular';

import {  Ride } from './../../../models/ride';
import {  Order } from './../../../interfaces/order';

import {  OrderHistory } from './../../../providers/order/history';
import {  OrderFavorite } from './../../../providers/order/favorites';

@Component({
    templateUrl: 'build/pages/account/modal/rides.html'
})
export class RidesModal {

    futureRides: Array<Order>;
    lastRides: Array<Order>;
    tab: string = "future";
    tabDats: Object;
    optionDetails: string; //id of item

    constructor(private nav: NavController, public OrderHistoryProvider: OrderHistory, public OrderFavoriteProvider: OrderFavorite) {

        this.nav = nav;

        this.tabDats = {
            future: 'Поездки будущие' ,
            last: 'Поездки прошлые'
        };

        this.futureRides = [];

        //this.lastRides = [
        //    new Ride('15 февраля, 22:05', {street: 'Комсомольская 69, п.1'}, {street: 'Большая Серпуховская, 64'}),
        //    new Ride('15 февраля, 22:05', {street: 'Комсомольская 69, п.1'}, {street: 'Большая Серпуховская, 64'}),
        //    new Ride('15 февраля, 22:05', {street: 'Комсомольская 69, п.1'}, {street: 'Большая Серпуховская, 64'}),
        //    new Ride('15 февраля, 22:05', {street: 'Комсомольская 69, п.1'}, {street: 'Большая Серпуховская, 64'})
        //];

        this.lastRides = this.OrderHistoryProvider.get();

        console.log(this.lastRides)
        //RideProvider.save('rides', this.lastRides);
        //let a = RideProvider.get('rides');
        //console.log(a);
    }


    public tabClick(value:string) {
        this.tab = value;
    }

    public getArrayOfRides() {
        return this.tab === 'future' ? this.futureRides : this.lastRides;
    }

    public showOptions(key: string, event: any) {
        this.optionDetails = key;
        event.stopPropagation();
    }

    public toFavorites(ride: Order, $event: any) {
        this.showOptions('', $event);
        this.OrderFavoriteProvider.save(ride);
    }

}