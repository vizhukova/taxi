import { Component } from '@angular/core';
import {  NavController } from 'ionic-angular';

@Component({
    templateUrl: 'build/pages/account/modal/rides.html',
})
export class RidesModal {

    futureRides: Array<Object>;
    lastRides: Array<Object>;
    tab: string = "future";
    tabDats: Object;

    constructor(private nav: NavController) {

        this.nav = nav;

        this.tabDats = {
            future: 'Поездки будущие' ,
            last: 'Поездки прошлые'
        };

        this.futureRides = [
            {time: '15 июля, 22:05', from: {street: 'Комсомольская 69, п.1'}, to: {street: 'Большая Серпуховская, 64'} }
        ];

        this.lastRides = [
            {time: '15 февраля, 22:05', from: {street: 'Комсомольская 69, п.1'}, to: {street: 'Большая Серпуховская, 64'} },
            {time: '15 февраля, 22:05', from: {street: 'Комсомольская 69, п.1'}, to: {street: 'Большая Серпуховская, 64'} },
            {time: '15 февраля, 22:05', from: {street: 'Комсомольская 69, п.1'}, to: {street: 'Большая Серпуховская, 64'} },
            {time: '15 февраля, 22:05', from: {street: 'Комсомольская 69, п.1'}, to: {street: 'Большая Серпуховская, 64'} }
        ];
    }


    public tabClick(value:string) {
        this.tab = value;
    }

    public getArrayOfRides() {
        return this.tab === 'future' ? this.futureRides : this.lastRides;
    }

}