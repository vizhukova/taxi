import { Component } from '@angular/core';
import {  NavController } from 'ionic-angular';

import {  Ride } from './../../../models/ride';
import {  Order } from './../../../interfaces/order';

import {  OrderFavorite } from './../../../providers/order/favorites';
import {  OrderHistory } from './../../../providers/order/history';
import {  Place } from './../../../providers/place/place';
import {  GatherOrder } from './../../../providers/order/gather_order';
import {  Nav } from './../../../providers/nav/nav';
import { CarOptions } from './../../../providers/car-options/car-options';
import { TimeProvider } from './../../../providers/time/time';
import { MapProvider } from './../../../providers/map/map';

@Component({
    templateUrl: 'build/pages/account/modal/rides.html'
})
export class RidesModal {

    futureRides: Array<Order>;
    lastRides: Array<Order>;
    tab: string = "future";
    tabDats: Object;
    optionDetails: string; //id of item

    constructor(private nav: NavController,
                public OrderHistoryProvider: OrderHistory,
                public PlaceProvider: Place,
                public GatherOrderProvider: GatherOrder,
                public OrderFavoriteProvider: OrderFavorite,
                public NavProvider: Nav,
                public CarOptionsProvider: CarOptions,
                public TimeProvider: TimeProvider,
                public MapProvider: MapProvider) {

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

        //this.lastRides = this.OrderHistoryProvider.get();

         OrderHistoryProvider.orders$.subscribe(orders => {
          this.lastRides = orders;
        });

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
        this.optionDetails =  this.optionDetails === key ? '-1' : key;
        event.stopPropagation();
    }

    public toFavorites(ride: Order, $event: any) {
        this.showOptions('', $event);
        this.OrderFavoriteProvider.save(ride);
    }

    public delete(num: number, $event: any) {
        this.showOptions('', $event);
        this.lastRides = this.lastRides.filter((item, index) => index != num);
        this.OrderHistoryProvider.changeOrders(this.lastRides);
    }

    setTrip(index) {

        var trips = this.lastRides;

        var curCoord = {
            from: {
                latitude: trips[index].source.lat,
                longitude: trips[index].source.lon
            },
            to: {
                latitude: trips[index].destinations[0].lat,
                longitude: trips[index].destinations[0].lon
            }
        };


        this.PlaceProvider.changeDetail({from: this.lastRides[index].source, to: this.lastRides[index].destinations[0]}, true);
        this.MapProvider.setMarker(curCoord);
        this.MapProvider.set('direction', '');
        this.nav.pop();
        this.NavProvider.changeTab('home');
    }
}