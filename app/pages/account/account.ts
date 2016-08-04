import { Component } from '@angular/core';
import { NavController, Modal, ViewController } from 'ionic-angular';
import {NavParams} from "ionic-angular/index";
import {Platform} from "ionic-angular/index";
import {RidesModal} from "./modal/rides";
import {Auth} from "../../providers/auth/auth";
import {OrderHistory} from "../../providers/order/history";
import {Order} from "../../interfaces/order";


@Component({
  selector: 'account-page',
  templateUrl: 'build/pages/account/account.html',
})
export class AccountPage {
  
  user:any;
  lastRidesLenth: number;

  constructor(private nav: NavController, private AuthProvider: Auth, public OrderHistoryProvider: OrderHistory) {
    this.nav = nav;

    this.user = {
      name: null,
      id: null,
      phone: null
    };

    this.lastRidesLenth = this.OrderHistoryProvider.get().length || 0;

    AuthProvider.user$.subscribe(user => {
      this.user = user;
    })
  }

  showRidesModal() {
    this.nav.push(RidesModal);
  }
}
