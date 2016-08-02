import {Component} from '@angular/core';
import {Map} from './../../components/map';
import {Address} from './../../components/address_panel';
import {Place} from './../../providers/place/place';
import {Cost} from './../../providers/cost/cost';
import {RegistrationModal} from './../../components/registration/registration';
import {NavController} from "ionic-angular/index";
// import polyline from 'polyline'


@Component({
    selector: 'home-page',
    templateUrl: 'build/pages/home/home.html',
    directives: [Map],
})
export class HomePage {

    isAddress:boolean;
    status:any;
    callEnable:Function;
    cost: number;

    ngOnInit() {
        this.callEnable = this.enableCall.bind(this);
    }

    constructor(private Place:Place, private nav:NavController, private CostProvider: Cost) {

        let self = this;

        this.nav = nav;

        this.status = {
            from: 'определение адреса подачи такси',
            to: 'определение адреса поездки',
        };
        
        this.makeRequest();
        this.isAddress = false;

        CostProvider.cost$.subscribe(cost => {
            self.cost = cost;
        })
    }

    enableCall(value) {
        this.isAddress = value;
    }


    makeRequest():void {
        this.Place.getPosition().then((coords:any) => {
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


