import {Component} from '@angular/core';
import { Map } from './../../components/map';
import { Address } from './../../components/address_panel';
import {Place} from './../../providers/place/place';
import {RegistrationModal} from './../../components/registration/registration';
import {NavController} from "ionic-angular/index";
// import polyline from 'polyline'


@Component({
  templateUrl: 'build/pages/home/home.html',
  directives: [Map],
})
export class HomePage{

    isAddress: boolean;
    status: any;
    callEnable: Function;

    ngOnInit(){
        this.callEnable = this.enableCall.bind(this);
    }

    constructor(private Place: Place, private nav: NavController) {

        const self = this;

        this.nav = nav;

        this.status ={
            from: 'определение адреса подачи такси',
            to: 'определение адреса поездки',
        };

        this.nav.push(RegistrationModal);
        this.makeRequest();
        this.isAddress = false;
    }
    
    enableCall() {
        this.isAddress = true;
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


