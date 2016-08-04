import { Component } from '@angular/core';
import {  NavController } from 'ionic-angular';
import {  RideProvider } from './../../../providers/ride/ride';
import {  Ride } from './../../../models/ride';
import {  OrderHistory } from './../../../providers/order/history';
import {  Order } from './../../../interfaces/order';

@Component({
    templateUrl: 'build/pages/account/modal/rides.html',
    providers: [RideProvider]
})
export class RidesModal {

    futureRides: Array<Order>;
    lastRides: Array<Order>;
    tab: string = "future";
    tabDats: Object;

    constructor(private nav: NavController, private RideProvider: RideProvider, public OrderHistoryProvider: OrderHistory) {

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

}