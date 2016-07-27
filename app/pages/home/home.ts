import {Component, ApplicationRef} from '@angular/core';
import {NgZone} from '@angular/core';
import {NavController} from 'ionic-angular';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Map } from './../../components/map';
import { Address } from './../../components/address_panel';
import {Place} from './../../providers/place/place';
// import polyline from 'polyline'


@Component({
  templateUrl: 'build/pages/home/home.html',
  directives: [Map, Address],
})
export class HomePage{

    names: string[];
    isAddress: boolean;
    direction: string = 'from';
    path: any;
    status: any;
    theBoundCallback: Function;
    callEnable: Function;

    ngOnInit(){
        this.theBoundCallback = this.onDragendMap.bind(this);
        this.callEnable = this.enableCall.bind(this);
    }

    constructor(private Place: Place) {

        const self = this;

        this.status ={
            from: 'определение адреса подачи такси',
            to: 'определение адреса поездки',
        };

        this.makeRequest();
        this.isAddress = false;
        this.path = [];

        Place.direction$.subscribe(newDirection => {
            self.direction = newDirection;
        })
    }
    
    enableCall() {
        this.isAddress = true;
    }

    markerClasses() {
        return {
            marker: true,
            from: this.direction === 'from'
        }
    }

    makeRequest(): void {
        this.Place.getPosition()
        .then((coords:any) => {
            this.Place.getCurrentAddress(coords);
        }).catch((err) => {
            debugger
        })
    }

    onDragendMap(coords) {

        this.Place.getCurrentAddress({
            latitude: coords.lat,
            longitude: coords.lng
        })
    }
}


