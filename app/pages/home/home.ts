import {Component} from '@angular/core';
import { Map } from './../../components/map';
import { Address } from './../../components/address_panel';
import {Place} from './../../providers/place/place';


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

    constructor(private Place: Place) {

        this.status ={
            from: 'определение адреса подачи такси',
            to: 'определение адреса поездки',
        };

        this.isAddress = false;
    }
    
    enableCall() {
        this.isAddress = true;
    }


    
}


