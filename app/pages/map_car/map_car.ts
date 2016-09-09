import { Component } from '@angular/core';
import { NavController, Modal, ViewController } from 'ionic-angular';
import {NavParams, Platform} from "ionic-angular/index";
import {Nav} from "../../providers/nav/nav";
import { DriverPanel } from '../../components/driver_panel/driver_panel';

@Component({
    selector: 'map-car',
    templateUrl: 'build/pages/map_car/map_car.html',
    directives: [DriverPanel]
})
export class MapCar {
    

    constructor(
        private nav: NavController,
        private NavProvider: Nav
    ) {
    
    }
    
}
