import { Component } from '@angular/core';
import { NavController, Modal, ViewController } from 'ionic-angular';
import {NavParams} from "ionic-angular/index";
import {Platform} from "ionic-angular/index";
import {RidesModal} from "./modal/rides";
import {Order} from "../../interfaces/order";

import {Auth} from "../../providers/auth/auth";
import {OrderHistory} from "../../providers/order/history";
import {Place} from "../../providers/place/place";
import {CarOptions} from "../../providers/car-options/car-options";
import {Nav} from "../../providers/nav/nav";
import {TimeProvider} from "../../providers/time/time";



@Component({
  selector: 'account-page',
  templateUrl: 'build/pages/account/account.html',
})
export class AccountPage {
  
  user:any;
  lastRidesLenth: number;

  constructor(private nav: NavController,
              private AuthProvider: Auth,
              public OrderHistoryProvider: OrderHistory,
              public PlaceProvider: Place,
              public CarOptionsProvider: CarOptions,
              public NavProvider: Nav,
              public TimeProvider: TimeProvider) {

    this.nav = nav;

    this.user = {
      name: null,
      id: null,
      phone: null
    };

    //this.lastRidesLenth = this.OrderHistoryProvider.get().length || 0;
    //debugger


    AuthProvider.user$.subscribe(user => {
      this.user = user;
    });

    OrderHistoryProvider.orders$.subscribe(orders => {
      this.lastRidesLenth = orders.length;
    });
  }

  showRidesModal() {
    this.nav.push(RidesModal, {}, {animate: false});
  }

  newRide() {
    this.PlaceProvider.changeDetail({
        to: '',
        from: ''
    }, true);
    this.PlaceProvider.changeCoords({
        to: '',
        from: ''
    });

    this.CarOptionsProvider.changerCarClass('');
    this.CarOptionsProvider.changerRequirements([]);
    this.TimeProvider.change(null);

    this.nav.pop();
    this.NavProvider.changeTab('home');
  }
}
