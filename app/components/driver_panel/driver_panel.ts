import { Component } from '@angular/core';
import {  NavController } from 'ionic-angular';
import {GatherOrder} from "../../providers/order/gather_order";
import { Car } from "../../providers/car/car";

@Component({
    selector: 'drive-panel',
    templateUrl: 'build/components/driver_panel/driver_panel.html',
})
export class DriverPanel {
    
    driver: any;
    status: string;
    interval: any;

    constructor(
        private Car: Car
    ) {

        Car.driver$.subscribe((newDriver)=>{
            this.driver = newDriver;
            this.status = this.decodeStatus(newDriver.status)
        });
    }
    

    decodeStatus(rawStatus) {
        switch(rawStatus) {
            case 'driving':
                return 'ЕДЕТ К ВАМ';
            case 'transporting':
                return 'ЗАКАЗ ВЫПОЛНЯЕТСЯ';
            case 'payment':
                return 'ОПЛАТА ЗАКАЗА';
            case 'complete':
                return 'ЗАКАЗ ВЫПОЛНЕН';
        }
    }

}