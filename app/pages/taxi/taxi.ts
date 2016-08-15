import { Component } from '@angular/core';
import { NavController, Modal, ViewController } from 'ionic-angular';
import {NavParams, Platform} from "ionic-angular/index";

import { DriverPanel } from './../../components/driver_panel/driver_panel';

@Component({
  selector: 'taxi-page',
  templateUrl: 'build/pages/taxi/taxi.html',
  directives: [DriverPanel]
})
export class TaxiPage {

}
